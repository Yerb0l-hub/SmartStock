-- SmartStock MVP. Run in a NEW Supabase project, not the UNISearch project.
-- Authenticated users only see and mutate their own products and sales.
create extension if not exists pgcrypto;
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 name text not null check(length(trim(name)) between 1 and 120),
 sku text not null check(length(trim(sku)) between 1 and 40),
 category text not null default 'Other',
 price numeric(14,2) not null default 0 check(price >= 0),
 cost numeric(14,2) not null default 0 check(cost >= 0),
 quantity integer not null default 0 check(quantity >= 0),
 min_stock integer not null default 5 check(min_stock >= 0),
 created_at timestamptz not null default now(),
 unique(owner_id,sku), unique(id,owner_id)
);
create table if not exists public.sales (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 product_id uuid not null,
 product_name text not null,
 quantity integer not null check(quantity > 0),
 unit_price numeric(14,2) not null check(unit_price >= 0),
 total numeric(16,2) not null check(total >= 0),
 created_at timestamptz not null default now(),
 foreign key (product_id,owner_id) references public.products(id,owner_id) on delete restrict
);
create index if not exists products_owner_idx on public.products(owner_id);
create index if not exists sales_owner_time_idx on public.sales(owner_id,created_at desc);
alter table public.products enable row level security;
alter table public.sales enable row level security;
drop policy if exists products_read on public.products;
create policy products_read on public.products for select to authenticated using(owner_id=(select auth.uid()));
drop policy if exists products_insert on public.products;
create policy products_insert on public.products for insert to authenticated with check(owner_id=(select auth.uid()) and quantity=0);
drop policy if exists products_update on public.products;
create policy products_update on public.products for update to authenticated using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
drop policy if exists products_delete on public.products;
create policy products_delete on public.products for delete to authenticated using(owner_id=(select auth.uid()));
drop policy if exists sales_read on public.sales;
create policy sales_read on public.sales for select to authenticated using(owner_id=(select auth.uid()));
-- Prevent direct client INSERT/UPDATE on sales. All writes go through audited RPCs.
revoke insert,update,delete on public.sales from anon,authenticated;
revoke all on public.products from anon;
revoke all on public.sales from anon;
grant select,insert,delete on public.products to authenticated;
grant select on public.sales to authenticated;
-- Column-level lock: client must not modify quantity except using RPC.
revoke update on public.products from authenticated;
-- Only descriptive columns are editable directly; inventory quantity changes through RPCs.
grant update(name,sku,category,price,cost,min_stock) on public.products to authenticated;
create or replace function public.adjust_stock(p_id uuid,p_delta integer)
returns void language plpgsql security definer set search_path = '' as $$
declare old_qty integer;
begin
 if auth.uid() is null then raise exception 'Login required'; end if;
 if p_delta is null or p_delta=0 then raise exception 'Enter a non-zero stock adjustment'; end if;
 select quantity into old_qty from public.products where id=p_id and owner_id=auth.uid() for update;
 if not found then raise exception 'Product not found'; end if;
 if old_qty::bigint+p_delta::bigint < 0 or old_qty::bigint+p_delta::bigint > 2147483647 then raise exception 'Invalid stock quantity'; end if;
 update public.products set quantity=old_qty+p_delta where id=p_id and owner_id=auth.uid();
end;$$;
create or replace function public.record_sale(p_id uuid,p_quantity integer)
returns uuid language plpgsql security definer set search_path = '' as $$
declare item public.products%rowtype; sale_id uuid;
begin
 if auth.uid() is null then raise exception 'Login required'; end if;
 if p_quantity is null or p_quantity<=0 then raise exception 'Quantity must be positive'; end if;
 select * into item from public.products where id=p_id and owner_id=auth.uid() for update;
 if not found then raise exception 'Product not found'; end if;
 if item.quantity<p_quantity then raise exception 'Not enough stock'; end if;
 update public.products set quantity=quantity-p_quantity where id=p_id and owner_id=auth.uid();
 insert into public.sales(owner_id,product_id,product_name,quantity,unit_price,total)
 values(auth.uid(),p_id,item.name,p_quantity,item.price,p_quantity*item.price)
 returning id into sale_id;
 return sale_id;
end;$$;
revoke all on function public.adjust_stock(uuid,integer) from public,anon;
revoke all on function public.record_sale(uuid,integer) from public,anon;
grant execute on function public.adjust_stock(uuid,integer) to authenticated;
grant execute on function public.record_sale(uuid,integer) to authenticated;
