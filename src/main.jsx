import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, CirclePlus, Flame, Heart, Minus, Plus, ShoppingBag, Sparkles, Trash2, X } from 'lucide-react'
import './style.css'

const WA = '6283853021353'
const products = [
  { id:'original', name:'Cimol Bodjot Aslian', short:'ASLIAN', desc:'Chili oil original dengan rasa gurih pedas yang pas.', prices:{small:8000,large:10000}, color:'rose', tag:'BEST SELLER', kind:'cooked' },
  { id:'mozza', name:'Cimol Bodjot Mozarellia', short:'MOZARELLIA', desc:'Isian mozzarella lembut di dalam, lumer di setiap gigitan.', prices:{small:10000,large:15000}, color:'butter', tag:'CHEESE LOVER', kind:'cooked' },
  { id:'frozen', name:'Cimol Bodjot Frozen Aslian', short:'FROZEN ASLIAN', desc:'Stok camilan di rumah. Tinggal goreng, tinggal happy.', prices:{pack:10000}, color:'sky', tag:'STOCK UP', kind:'frozen' },
  { id:'frozen-mozza', name:'Cimol Bodjot Frozen Mozarellia', short:'FROZEN MOZZA', desc:'Frozen cimol dengan isian mozzarella buat stok ngemil.', prices:{pack:15000}, color:'lilac', tag:'FREEZER FAVE', kind:'frozen' },
]
const rupiah = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n)
const readCart = () => { try { return JSON.parse(localStorage.getItem('cimolCart') || '[]') } catch { return [] } }
const fadeUp = { hidden:{opacity:0,y:28}, show:{opacity:1,y:0,transition:{duration:.65,ease:[.22,1,.36,1]}} }
const stagger = { hidden:{}, show:{transition:{staggerChildren:.12}} }

function ProductArt({product}) {
  return <div className={`product-art ${product.color}`}>
    <span className="art-tag">{product.tag}</span>
    <motion.div className={`food-illustration ${product.kind}`} whileHover={{rotate:[0,-5,4,0],scale:1.06}} transition={{duration:.55}}>
      {product.kind==='cooked' ? <><div className="bowl"><i/><i/><i/><i/><i/><span className="sauce"/></div><span className="food-spark">✳</span></> : <div className="pack"><small>READY TO COOK</small><b>{product.short}</b><span>✳</span></div>}
    </motion.div>
    <span className="art-caption">BODJOT YOUR MOOD</span>
  </div>
}

function Header({count}) {
  return <header className="header"><a className="logo" href="#home"><img src="https://i.imgur.com/jVIjhfF.png" alt=""/><span>CIMOL<br/><b>BODJOTEL<span>.</span></b></span></a><nav><a href="#menu">Menu</a><a href="#story">Our story</a><a href="#how">Cara pesan</a></nav><a className="header-order" href="#order"><ShoppingBag size={16}/> <span>Pesan sekarang</span><b>{count}</b></a></header>
}

function App(){
 const [cart,setCart]=useState(readCart)
 const [active,setActive]=useState(null)
 const [size,setSize]=useState('small')
 const [spice,setSpice]=useState(2)
 const [toast,setToast]=useState('')
 const [form,setForm]=useState({name:'',phone:'',fulfillment:'delivery',payment:'COD',address:'',notes:''})
 const [faq,setFaq]=useState(0)
 const count=cart.reduce((s,x)=>s+x.qty,0)
 const subtotal=cart.reduce((s,x)=>{const p=products.find(y=>y.id===x.id);return s+(p?.prices[x.size]||0)*x.qty},0)
 useEffect(()=>{localStorage.setItem('cimolCart',JSON.stringify(cart))},[cart])
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2400);return()=>clearTimeout(t)},[toast])
 const openProduct=p=>{setActive(p);setSize(p.kind==='cooked'?'small':'pack');setSpice(2)}
 const add=()=>{if(!active)return;const key=active.id+'-'+size+'-'+(active.kind==='cooked'?spice:'na');setCart(old=>{const found=old.find(x=>x.key===key);return found?old.map(x=>x.key===key?{...x,qty:x.qty+1}:x):[...old,{key,id:active.id,size,spice,qty:1}]});setActive(null);setToast('Masuk keranjang! Saatnya ngemil ✳')}
 const change=(key,delta)=>setCart(old=>old.map(x=>x.key===key?{...x,qty:x.qty+delta}:x).filter(x=>x.qty>0))
 const remove=key=>setCart(old=>old.filter(x=>x.key!==key))
 const sendOrder=e=>{e.preventDefault();if(!cart.length){setToast('Keranjangmu masih kosong. Pilih menu dulu, ya!');return}const lines=cart.map((x,i)=>{const p=products.find(y=>y.id===x.id);return `${i+1}. ${p.name} / ${x.size==='small'?'Kecil':x.size==='large'?'Besar':'1 pack'}${p.kind==='cooked'?' / Level pedas '+x.spice:''} / ${x.qty}x = ${rupiah(p.prices[x.size]*x.qty)}`});const msg=['HALO CIMOL BODJOTEL! Aku mau pesan:','',...lines,'','Subtotal: '+rupiah(subtotal),'Ongkir: '+(form.fulfillment==='pickup'?'Ambil sendiri / gratis':'Mohon konfirmasi admin'),'','Nama: '+form.name,'No. WhatsApp: '+form.phone,'Cara menerima: '+(form.fulfillment==='pickup'?'Ambil sendiri':'Diantar'),...(form.fulfillment==='pickup'?[]:['Alamat: '+form.address]),'Pembayaran: '+form.payment,'Catatan: '+(form.notes||'-'),'','Mohon konfirmasi pesanan dan total akhirnya. Terima kasih!'].join('\n');window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg),'_blank','noopener')}
 const updateForm=(k,v)=>setForm(f=>({...f,[k]:v}))
 return <div id="home">
  <div className="announcement"><Sparkles size={13}/> FRESHLY MADE • PEDASNYA BISA KAMU ATUR • HAPPY SNACKING!</div>
  <Header count={count}/>
  <main>
   <section className="hero">
    <motion.div className="hero-copy" initial="hidden" animate="show" variants={stagger}>
      <motion.div className="eyebrow-pill" variants={fadeUp}><span/> YOUR NEW FAVORITE SNACK</motion.div>
      <motion.h1 variants={fadeUp}>SEKALI<br/>NYOBA,<br/><em>MAUNYA</em><br/><em>LAGI.</em></motion.h1>
      <motion.p variants={fadeUp}>Cimol bodjot dengan chili oil yang gurih, pedas, dan bikin nagih. Dibuat buat nemenin mood terbaikmu.</motion.p>
      <motion.div className="hero-actions" variants={fadeUp}><a className="btn dark" href="#menu">TEMUKAN FAVORITMU <ArrowDown size={16}/></a><a className="text-link" href="#story">Kenalan dulu <ArrowUpRight size={15}/></a></motion.div>
      <motion.div className="hero-note" variants={fadeUp}><span>✳</span><div><b>CRUNCHY OUTSIDE.</b><br/>HAPPY INSIDE.</div></motion.div>
    </motion.div>
    <motion.div className="hero-art" initial={{opacity:0,scale:.82,rotate:5}} animate={{opacity:1,scale:1,rotate:0}} transition={{duration:1,ease:[.16,1,.3,1],delay:.2}}>
      <motion.div className="orbit orbit-a" animate={{rotate:360}} transition={{duration:42,repeat:Infinity,ease:'linear'}}/>
      <motion.div className="orbit orbit-b" animate={{rotate:-360}} transition={{duration:55,repeat:Infinity,ease:'linear'}}/>
      <motion.div className="hero-bowl"><div className="bowl-food"><i/><i/><i/><i/><i/><span/></div></motion.div>
      <motion.div className="sticker" animate={{rotate:[-10,-4,-10],y:[0,-8,0]}} transition={{duration:4,repeat:Infinity,ease:'easeInOut'}}>PEDAS<br/><b>ASIK!</b><span>✳</span></motion.div>
      <span className="hero-caption">SMALL BITES<br/>BIG HAPPINESS</span><motion.span className="sparkle s-one" animate={{rotate:360,scale:[1,1.2,1]}} transition={{duration:7,repeat:Infinity}}>✳</motion.span><span className="sparkle s-two">✳</span>
    </motion.div>
   </section>
   <div className="ticker"><motion.div animate={{x:['0%','-50%']}} transition={{duration:24,repeat:Infinity,ease:'linear'}}>GURIH ✳ PEDAS ✳ NAGIH ✳ MOZARELLA LUMER ✳ GURIH ✳ PEDAS ✳ NAGIH ✳ MOZARELLA LUMER ✳&nbsp;&nbsp;&nbsp; GURIH ✳ PEDAS ✳ NAGIH ✳ MOZARELLA LUMER ✳</motion.div></div>
   <section className="menu section" id="menu">
    <motion.div className="section-head" initial="hidden" whileInView="show" viewport={{once:true,amount:.25}} variants={stagger}><motion.div variants={fadeUp}><span className="eyebrow">THE LINE-UP / 01—04</span><h2>KENALAN SAMA<br/><em>CALON FAVORITMU.</em></h2></motion.div><motion.p variants={fadeUp}>Empat pilihan, satu tujuan:<br/>bikin ngemil jadi lebih seru.</motion.p></motion.div>
    <motion.div className="products" variants={stagger} initial="hidden" whileInView="show" viewport={{once:true,amount:.12}}>
      {products.map((p,i)=><motion.article className="product-card" key={p.id} variants={fadeUp} whileHover={{y:-9,rotate:i%2?-.5:.5}} transition={{type:'spring',stiffness:260,damping:18}}>
       <ProductArt product={p}/><div className="product-info"><span className="product-kicker">{p.kind==='cooked'?'THE CLASSIC ONE':'KEEP IT READY'}</span><h3>{p.name}</h3><p>{p.desc}</p><div className="product-foot"><div><small>MULAI DARI</small><b>{rupiah(Math.min(...Object.values(p.prices)))}</b></div><button onClick={()=>openProduct(p)} aria-label={'Pilih '+p.name}><Plus/></button></div></div>
      </motion.article>)}
    </motion.div><p className="menu-note">Menu matang tersedia ukuran kecil dan besar. Level pedas bisa dipilih dari 1 sampai 4.</p>
   </section>
   <section className="manifesto" id="story"><motion.div className="manifesto-inner" initial="hidden" whileInView="show" viewport={{once:true,amount:.3}} variants={stagger}><motion.div className="manifesto-stamp" variants={fadeUp}>BODJOT<br/>YOUR<br/>MOOD!</motion.div><motion.div variants={fadeUp}><span className="eyebrow">NOT JUST A SNACK / 02</span><h2>MOOD JELEK?<br/><em>COBA NGEMIL.</em></h2><p>Karena hari yang biasa aja bisa jadi lebih seru ditemani cimol bodjot favoritmu.</p></motion.div><motion.div className="manifesto-aside" variants={fadeUp}>MADE TO<br/>MAKE YOU<br/>SMILE <Heart/></motion.div></motion.div></section>
   <section className="how section" id="how"><div><span className="eyebrow">NO DRAMA, JUST SNACK / 03</span><h2>3 LANGKAH<br/>MENUJU <em>BAHAGIA.</em></h2></div><div className="steps">{['Pilih yang kamu suka|Original, mozzarella, atau frozen buat stok.','Atur pesananmu|Pilih ukuran, level pedas, dan cara menerima.','Checkout via WhatsApp|Konfirmasi pesanan langsung dengan admin.'].map((x,i)=><motion.div className="step" key={x} initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.13}}><b>0{i+1}</b><div><strong>{x.split('|')[0]}</strong><p>{x.split('|')[1]}</p></div></motion.div>)}</div></section>
   <section className="faq"><span className="eyebrow">GOOD TO KNOW</span><h2>ADA YANG MAU<br/><em>DITANYAIN?</em></h2>{['Bisa pilih level pedas?','Bagaimana cara pesan?','Apakah tersedia frozen?'].map((q,i)=><div className="faq-item" key={q}><button onClick={()=>setFaq(faq===i?-1:i)}>{q}<ChevronDown className={faq===i?'turned':''}/></button><AnimatePresence>{faq===i&&<motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>{['Bisa! Untuk cimol matang tersedia level pedas 1 sampai 4.','Pilih produk, atur ukuran dan level pedas, lalu checkout melalui WhatsApp.','Ada! Frozen Aslian dan Frozen Mozarellia siap jadi stok camilan di rumah.'][i]}</motion.p>}</AnimatePresence></div>)}</section>
   <section className="order section" id="order"><div className="order-heading"><span className="eyebrow">YOUR SNACK ERA STARTS HERE / 04</span><h2>UDAH KEBAYANG<br/><em>ENAKNYA?</em></h2><p>Pilih camilanmu, isi detail pesanan, lalu kirim ke WhatsApp kami.</p></div><div className="checkout">
    <div className="cart-panel"><div className="panel-title"><h3>Keranjangmu</h3><span>{count} ITEM</span></div>{cart.length===0?<div className="empty">Belum ada camilan dipilih. Yuk, intip menu dulu! <a href="#menu">Lihat menu <ArrowRight size={14}/></a></div>:cart.map(x=>{const p=products.find(y=>y.id===x.id);return <div className="cart-line" key={x.key}><div><b>{p.name}</b><small>{x.size==='small'?'Ukuran kecil':x.size==='large'?'Ukuran besar':'1 pack'}{p.kind==='cooked'?' · Level '+x.spice:''}</small><div className="quantity"><button onClick={()=>change(x.key,-1)}><Minus size={12}/></button><span>{x.qty}</span><button onClick={()=>change(x.key,1)}><Plus size={12}/></button><button className="delete" onClick={()=>remove(x.key)}><Trash2 size={13}/></button></div></div><strong>{rupiah(p.prices[x.size]*x.qty)}</strong></div>})}
     <div className="subtotal"><span>Subtotal</span><b>{rupiah(subtotal)}</b></div><div className="subtotal"><span>Ongkir</span><span>{form.fulfillment==='pickup'?'Gratis':'Dikonfirmasi admin'}</span></div><div className="total"><span>TOTAL SEMENTARA</span><b>{rupiah(subtotal)}</b></div>
    </div>
    <form className="form-panel" onSubmit={sendOrder}><h3>Detail pesanan</h3><label>Nama lengkap<input required value={form.name} onChange={e=>updateForm('name',e.target.value)} placeholder="Nama kamu"/></label><label>Nomor WhatsApp<input required inputMode="tel" value={form.phone} onChange={e=>updateForm('phone',e.target.value)} placeholder="08xxxxxxxxxx"/></label><div className="form-row"><label>Cara menerima<select value={form.fulfillment} onChange={e=>updateForm('fulfillment',e.target.value)}><option value="delivery">Diantar</option><option value="pickup">Ambil sendiri</option></select></label><label>Pembayaran<select value={form.payment} onChange={e=>updateForm('payment',e.target.value)}><option>COD</option><option>Transfer bank</option></select></label></div>{form.fulfillment==='delivery'&&<label>Alamat pengantaran<textarea required value={form.address} onChange={e=>updateForm('address',e.target.value)} placeholder="Nama jalan, nomor rumah, patokan..."/></label>}<label>Catatan<textarea value={form.notes} onChange={e=>updateForm('notes',e.target.value)} placeholder="Catatan tambahan (opsional)"/></label><button className="btn dark send" type="submit">KIRIM PESANAN VIA WHATSAPP <ArrowUpRight size={17}/></button><small className="fineprint">Ongkir dan detail rekening transfer akan dikonfirmasi admin. Total di atas belum termasuk ongkir.</small></form>
   </div></section>
   <section className="final-cta"><Sparkles/><h2>GOOD FOOD.<br/><em>GOOD MOOD.</em></h2><a className="btn dark" href="#menu">PILIH CAMILANMU <ArrowRight size={16}/></a></section>
  </main>
  <footer><a className="logo" href="#home"><img src="https://i.imgur.com/jVIjhfF.png" alt=""/><span>CIMOL<br/><b>BODJOTEL<span>.</span></b></span></a><p>Small bites. Big happiness.</p><a href={'https://wa.me/'+WA} target="_blank" rel="noreferrer">CHAT ADMIN <ArrowUpRight size={14}/></a><small>© 2026 CIMOL BODJOTEL. MADE WITH LOVE.</small></footer>
  <AnimatePresence>{active&&<motion.div className="modal-scrim" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setActive(null)}><motion.div className="product-modal" initial={{y:35,scale:.96}} animate={{y:0,scale:1}} exit={{y:20,scale:.97}} onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={()=>setActive(null)}><X/></button><span className="eyebrow">CUSTOMIZE YOUR SNACK</span><h2>{active.name}</h2>{active.kind==='cooked'?<><b className="field-title">PILIH UKURAN</b><div className="choice-row">{['small','large'].map(s=><button className={size===s?'chosen':''} onClick={()=>setSize(s)} key={s}>{s==='small'?'Kecil':'Besar'} · {rupiah(active.prices[s])}</button>)}</div><b className="field-title">LEVEL PEDAS</b><div className="choice-row spices">{[1,2,3,4].map(n=><button className={spice===n?'chosen':''} onClick={()=>setSpice(n)} key={n}><Flame size={14}/> {n}</button>)}</div></>:<div className="frozen-price">1 pack · {rupiah(active.prices.pack)}</div>}<button className="btn dark modal-add" onClick={add}>TAMBAH KE KERANJANG <Plus size={16}/></button></motion.div></motion.div>}</AnimatePresence>
  <AnimatePresence>{toast&&<motion.div className="toast" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}}>{toast}</motion.div>}</AnimatePresence>
 </div>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
