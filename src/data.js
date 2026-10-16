import { createClient } from '@supabase/supabase-js';
const url=import.meta.env.VITE_SUPABASE_URL;
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const online=Boolean(url&&key);
const supa=online?createClient(url,key):null;
const demo=[
 {id:'p1',name:'Samsung A55 128GB',sku:'ELEC-001',category:'Electronics',price:159900,cost:129000,quantity:12,min_stock:4},
 {id:'p2',name:'USB-C Cable 1m',sku:'ACC-002',category:'Accessories',price:2990,cost:1100,quantity:27,min_stock:10},
 {id:'p3',name:'Wireless Mouse',sku:'ACC-003',category:'Accessories',price:6990,cost:4200,quantity:6,min_stock:8},
 {id:'p4',name:'Notebook A5',sku:'OFF-004',category:'Stationery',price:890,cost:400,quantity:43,min_stock:15},
 {id:'p5',name:'Power Bank 10000mAh',sku:'ELEC-005',category:'Electronics',price:14990,cost:9900,quantity:3,min_stock:5}
];
const storeKey='smartstock-demo-v1';
const randomId=()=>crypto.randomUUID();
const demoState=()=>{try{return JSON.parse(localStorage.getItem(storeKey))||{products:demo,sales:[]}}catch{return {products:demo,sales:[]}}};
const setDemo=s=>localStorage.setItem(storeKey,JSON.stringify(s));
let currentUser=null;
export async function session(){if(!supa)return null;const {data,error}=await supa.auth.getUser();if(error&&!/Auth session missing/i.test(error.message))throw error;currentUser=data?.user||null;return currentUser}
export function observeAuth(fn){if(!supa)return ()=>{};const {data}=supa.auth.onAuthStateChange((_evt,session)=>{currentUser=session?.user||null;fn(currentUser)});return ()=>data.subscription.unsubscribe()}
export async function signIn(email,password){if(!supa)throw Error('Configure Supabase to enable sign in');const {error}=await supa.auth.signInWithPassword({email,password});if(error)throw error}
export async function signUp(email,password){if(!supa)throw Error('Configure Supabase to enable registration');const {data,error}=await supa.auth.signUp({email:String(email).trim(),password,options:{emailRedirectTo:location.origin+'/'}});if(error)throw error;return data}
export async function resendConfirmation(email){if(!supa)throw Error('Supabase is not configured');const address=String(email||'').trim();if(!address)throw Error('Enter your email first');const {error}=await supa.auth.resend({type:'signup',email:address,options:{emailRedirectTo:location.origin+'/'}});if(error)throw error;return true}
export async function requestPasswordReset(email){if(!supa)throw Error('Supabase is not configured');const address=String(email||'').trim();if(!address)throw Error('Enter your email first');const {error}=await supa.auth.resetPasswordForEmail(address,{redirectTo:location.origin+'/?password-reset=1'});if(error)throw error}
export async function updatePassword(password){if(!supa)throw Error('Supabase is not configured');if(String(password).length<8)throw Error('Use at least 8 characters');const {error}=await supa.auth.updateUser({password});if(error)throw error}
export async function signInGoogle(){if(!supa)throw Error('Configure Supabase to enable Google sign in');const {error}=await supa.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin}});if(error)throw error}
export async function signOut(){if(!supa)return;const {error}=await supa.auth.signOut();if(error)throw error}
export async function load(){if(!online){const s=demoState();return {products:s.products,sales:s.sales}}if(!currentUser)throw Error('Please sign in to load inventory');const [p,s]=await Promise.all([supa.from('products').select('*').order('created_at',{ascending:false}),supa.from('sales').select('id,product_id,quantity,unit_price,total,created_at,product_name').order('created_at',{ascending:false}).limit(500)]);if(p.error)throw p.error;if(s.error)throw s.error;return {products:p.data,sales:s.data}}
const positive=(n)=>Number.isFinite(Number(n))&&Number(n)>=0;
export async function saveProduct(p){const value={name:p.name.trim(),sku:p.sku.trim(),category:p.category.trim()||'Other',price:Number(p.price),cost:Number(p.cost),min_stock:Number(p.min_stock)};if(!value.name||!value.sku||!positive(value.price)||!positive(value.cost)||!Number.isInteger(value.min_stock)||value.min_stock<0)throw Error('Please enter valid product fields');if(!online){const s=demoState();if(s.products.some(x=>x.sku.toLowerCase()===value.sku.toLowerCase()&&x.id!==p.id))throw Error('SKU already exists');if(p.id){const x=s.products.find(x=>x.id===p.id);if(!x)throw Error('Product not found');Object.assign(x,value)}else s.products.unshift({...value,id:randomId(),quantity:0});setDemo(s);return}if(!currentUser)throw Error('Sign in first');const q=p.id?supa.from('products').update(value).eq('id',p.id):supa.from('products').insert({...value,owner_id:currentUser.id});const {error}=await q;if(error)throw error}
export async function adjustStock(id,delta){if(!Number.isInteger(Number(delta))||Number(delta)===0)throw Error('Enter a non-zero whole quantity');if(!online){const s=demoState();const p=s.products.find(x=>x.id===id);if(!p||p.quantity+Number(delta)<0)throw Error('Insufficient stock');p.quantity+=Number(delta);setDemo(s);return}const {error}=await supa.rpc('adjust_stock',{p_id:id,p_delta:Number(delta)});if(error)throw error}
export async function recordSale(id,quantity){quantity=Number(quantity);if(!Number.isInteger(quantity)||quantity<=0)throw Error('Enter a positive whole quantity');if(!online){const s=demoState();const p=s.products.find(x=>x.id===id);if(!p||quantity>p.quantity)throw Error('Not enough stock');p.quantity-=quantity;s.sales.unshift({id:randomId(),product_id:id,product_name:p.name,quantity,unit_price:p.price,total:Math.round(p.price*quantity),created_at:new Date().toISOString()});setDemo(s);return}const {error}=await supa.rpc('record_sale',{p_id:id,p_quantity:quantity});if(error)throw error}
export async function removeProduct(id){if(!online){const s=demoState();s.products=s.products.filter(x=>x.id!==id);setDemo(s);return}const {error}=await supa.from('products').delete().eq('id',id);if(error)throw error}
export function resetDemo(){if(!online)localStorage.removeItem(storeKey)}
