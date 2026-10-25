// 白針的收藏冊｜自動匯入 v4
// 角色 -繪師 リクエストYYMMDD[-差分序號].jpg/png/webp/tif
// 以「角色＋繪師＋完稿日」比對舊作品；唯一匹配時，只更新 id / image。
// 匯入資訊與 SHA256 不放 works.js，另存 data/import-history.json。
// 只有所有必要檔案與作品頁成功完成後才刪除「匯入原圖」的副本。
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const vm=require('node:vm');
const os=require('node:os');
const {spawnSync}=require('node:child_process');
let sharp;
try { sharp=require('sharp'); }
catch { console.error('缺少 sharp，請在 Gallery 根目錄執行 npm.cmd install');process.exit(1); }
const ROOT=__dirname;
const INBOX=path.join(ROOT,'匯入原圖');
const IMAGES=path.join(ROOT,'images');
const THUMBS=path.join(IMAGES,'thumbs');
const WORKS=path.join(ROOT,'data','works.js');
const ARTISTS=path.join(ROOT,'data','artists.js');
const HISTORY=path.join(ROOT,'data','import-history.json');
const GENERATOR=path.join(ROOT,'generate-pages.js');
const EXTS=new Set(['.jpg','.jpeg','.png','.webp','.tif','.tiff']);
const STABLE_MS=2000;
const BACKUPS=path.join(os.tmpdir(),'shirahari-gallery-import-backups');
const log=s=>console.log(`[${new Date().toLocaleTimeString('zh-TW',{hour12:false})}] ${s}`);
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const hashFile=f=>sha(fs.readFileSync(f));
const norm=s=>String(s||'').normalize('NFKC').replace(/\s+/gu,'').toLocaleLowerCase();
function readFresh(f){delete require.cache[require.resolve(f)];return require(f);}
function writeSafe(file,source){
 if(file.endsWith('.js'))new vm.Script(source,{filename:file});
 fs.mkdirSync(BACKUPS,{recursive:true});
 const tag=sha(ROOT).slice(0,10);
 if(fs.existsSync(file))fs.copyFileSync(file,path.join(BACKUPS,`${path.basename(file)}-${tag}.bak`));
 const tmp=file+`.tmp-${process.pid}`;
 try{fs.writeFileSync(tmp,source,'utf8');fs.renameSync(tmp,file);}
 finally{if(fs.existsSync(tmp))fs.unlinkSync(tmp);}
}
function readHistory(){
 if(!fs.existsSync(HISTORY))return {version:1,files:[]};
 const h=JSON.parse(fs.readFileSync(HISTORY,'utf8'));
 if(h.version!==1||!Array.isArray(h.files))throw new Error('匯入歷史格式不正確');
 return h;
}
function writeHistory(h){writeSafe(HISTORY,JSON.stringify(h,null,2)+'\n');}
function parseFilename(filename){
 const stem=path.parse(filename).name.normalize('NFC').trim();
 const m=stem.match(/^(.+)\s+[-－—]\s*(.+?)\s+リクエスト\s*(\d{6})(?:-(\d+))?$/u);
 if(!m)return null;
 const year=2000+Number(m[3].slice(0,2));
 const month=Number(m[3].slice(2,4)),day=Number(m[3].slice(4,6));
 const d=new Date(Date.UTC(year,month-1,day));
 if(d.getUTCFullYear()!==year||d.getUTCMonth()!==month-1||d.getUTCDate()!==day)return null;
 const variantNumber=m[4]===undefined?null:Number(m[4]);
 if(variantNumber!==null&&(!Number.isSafeInteger(variantNumber)||variantNumber<1))return null;
 return {character:m[1].trim(),artistName:m[2].trim(),date:`${year}-${m[3].slice(2,4)}-${m[3].slice(4,6)}`,variantNumber};
}
function findArtist(artists,name){
 const n=norm(name), ids=Object.keys(artists);
 const strip=s=>norm(s).replace(/[（(][^()（）]*[)）]/gu,'');
 const aliases=ids.filter(id=>strip(artists[id].name)===strip(name));
 // 已存在「GIBUN」及先前自動建立的「GIBUN(ギブン)」時，
 // 優先沿用非臨時 ID，避免失去原本 X/Pixiv/Skeb 連結。
 const canonical=aliases.filter(id=>!id.startsWith('artist-'));
 if(canonical.length===1)return canonical[0];
 const exact=ids.filter(id=>norm(artists[id].name)===n);
 if(exact.length===1)return exact[0];
 return aliases.length===1?aliases[0]:null;
}
function addArtist(src,id,name){
 const i=src.lastIndexOf('\n};');
 if(i<0||!src.includes('const artists ='))throw new Error('無法辨識 artists.js 格式');
 const first=src.slice(0,i).trimEnd();
 return first+(first.endsWith(',')?'':',')+`\n\n    ${JSON.stringify(id)}: {\n        name: ${JSON.stringify(name)},\n        x: "",\n        pixiv: "",\n        skeb: "",\n        links: []\n    }`+src.slice(i);
}
function locateWorkBlock(source,id){
 const pattern=/\bid\s*:\s*(["'])(.*?)\1/g;
 let m;
 while((m=pattern.exec(source))){
  if(m[2]!==id)continue;
  const start=source.lastIndexOf('{',m.index),end=source.indexOf('}',pattern.lastIndex);
  if(start<0||end<0)throw new Error('無法解析作品：'+id);
  return {start,end:end+1,body:source.slice(start,end+1)};
 }
 throw new Error('找不到作品：'+id);
}
function updateFields(source,oldId,fields){
 const b=locateWorkBlock(source,oldId);
 let updated=b.body;
 for(const [key,value] of Object.entries(fields)){
  const re=new RegExp(`(\\b${key}\\s*:\\s*)(["'][^"']*["']|true|false|\\d+)`);
  if(!re.test(updated))throw new Error(`作品 ${oldId} 缺少欄位 ${key}`);
  updated=updated.replace(re,(_m,prefix)=>prefix+JSON.stringify(value));
 }
 return source.slice(0,b.start)+updated+source.slice(b.end);
}
function addWork(source,w){
 const idx=source.lastIndexOf('\n];');
 if(idx<0||!source.includes('const works ='))throw new Error('無法辨識 works.js 格式');
 const body=source.slice(0,idx).trimEnd();
 const fields=['id','title','date','character','artist','published','image','mobilePosition'];
 const block='    {\n'+fields.map(k=>`        ${k}: ${JSON.stringify(w[k])}`).join(',\n')+'\n    }';
 return body+(body.endsWith(',')?'':',')+'\n\n'+block+source.slice(idx);
}
function workMatches(w,p,artistId){return norm(w.character)===norm(p.character)&&w.artist===artistId&&w.date===p.date;}
function resolveMatch(works,p,artistId,history){
 const same=works.filter(w=>workMatches(w,p,artistId));
 if(same.length===0)return {work:null};
 // 已匯入的工作，由檔名與 manifest 指定唯一 ID（不依陣列順序猜）。
 const inGroup=history.files.filter(h=>norm(h.character)===norm(p.character)&&h.artist===artistId&&h.date===p.date);
 if(p.variantNumber!==null){
  const sameVariant=inGroup.filter(h=>h.variantNumber===p.variantNumber);
  if(sameVariant.length===1){
   const found=same.find(w=>w.id===sameVariant[0].id);
   if(found)return {work:found};
  }
 }
 if(same.length===1){
  // 單筆同鍵作品已由其他差分用過時，不可覆蓋它。
  const used=inGroup.some(h=>h.id===same[0].id&&h.variantNumber!==p.variantNumber);
  if(used)return {work:null};
  return {work:same[0]};
 }
 // 已建多張差分時，不以三鍵自動決定要改哪張；新增未登錄序號視為獨立差分。
 if(p.variantNumber!==null&&inGroup.length===same.length&&!inGroup.some(h=>h.variantNumber===p.variantNumber))return {work:null};
 return {ambiguous:same.map(w=>w.id)};
}
async function exportImages(source,id){
 const full=path.join(IMAGES,id+'.jpg');
 const thumb=path.join(THUMBS,id+'.jpg');
 const temp1=path.join(IMAGES,`.import-${process.pid}-${id}.jpg`);
 const temp2=path.join(THUMBS,`.import-${process.pid}-${id}.jpg`);
 try{
  if(!fs.existsSync(full)){
   await sharp(source).rotate().flatten({background:'#f7f4ef'})
    .resize(1920,1080,{fit:'contain',background:'#f7f4ef'})
    .jpeg({quality:88,mozjpeg:true}).toFile(temp1);
   fs.renameSync(temp1,full);
  }
  if(!fs.existsSync(thumb)){
   await sharp(full).resize(640,360).jpeg({quality:78,mozjpeg:true}).toFile(temp2);
   fs.renameSync(temp2,thumb);
  }
 }finally{for(const f of [temp1,temp2])if(fs.existsSync(f))fs.unlinkSync(f);}
 return {full,thumb};
}
function valid(works,artists){
 const errors=[],ids=new Set(),images=new Set();
 for(const w of works){
  if(!w.id||ids.has(w.id))errors.push('ID 重複：'+w.id);ids.add(w.id);
  if(w.image&&images.has(w.image))errors.push('圖片重複：'+w.image);images.add(w.image);
  if(w.published!==true)continue;
  if(!String(w.title||'').trim()||!w.character||!artists[w.artist])errors.push('資料不足：'+w.id);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(w.date||''))errors.push('日期格式：'+w.id);
  if(!w.image||!fs.existsSync(path.join(ROOT,w.image)))errors.push('缺少原圖：'+w.id);
 }
 return errors;
}
let busy=false,again=false,lastBuild='',lastError='',timer=null;
function schedule(delay=800){clearTimeout(timer);timer=setTimeout(()=>scan().catch(e=>log('錯誤：'+e.stack)),delay);}
async function scan(){
 if(busy){again=true;return;}
 busy=true;
 try{
  let worksSrc=fs.readFileSync(WORKS,'utf8');
  let artistsSrc=fs.readFileSync(ARTISTS,'utf8');
  let works=readFresh(WORKS).works;
  let artists=readFresh(ARTISTS).artists;
  let history=readHistory();
  if(!Array.isArray(works)||!artists)throw new Error('works 或 artists 格式異常');
  fs.mkdirSync(INBOX,{recursive:true});fs.mkdirSync(IMAGES,{recursive:true});fs.mkdirSync(THUMBS,{recursive:true});
  const names=fs.readdirSync(INBOX,{withFileTypes:true})
   .filter(x=>x.isFile()&&EXTS.has(path.extname(x.name).toLowerCase()))
   .map(x=>x.name).sort();
  const completed=[];
  for(const filename of names){
   const source=path.join(INBOX,filename);
   const stat=fs.statSync(source);
   if(!stat.size||Date.now()-stat.mtimeMs<STABLE_MS)continue;
   const p=parseFilename(filename);
   if(!p){if(lastError!==filename)log('檔名格式或日期錯誤，保留：'+filename);lastError=filename;continue;}
   const hash=hashFile(source);
   const old=history.files.find(h=>h.filename===filename);
   if(old){
    const current=works.find(w=>w.id===old.id);
    const img=current?.image&&path.join(ROOT,current.image);
    const th=img&&path.join(THUMBS,path.basename(img));
    if(old.hash!==hash||!current||!img||!fs.existsSync(img)||!fs.existsSync(th)){
     log('已登錄檔名內容不同、資料或圖片缺失，保留：'+filename);continue;
    }
    completed.push({source,stat,hash,filename});continue;
   }
   // 相同位元組的重複匯入可略過，但不可誤刪不同 -1/-2 差分。
   const prior=history.files.find(h=>h.hash===hash&&norm(h.character)===norm(p.character)&&h.date===p.date&&h.variantNumber===p.variantNumber);
   if(prior){
    const current=works.find(w=>w.id===prior.id),img=current?.image&&path.join(ROOT,current.image);
    if(img&&fs.existsSync(img)&&fs.existsSync(path.join(THUMBS,path.basename(img)))){
     completed.push({source,stat,hash,filename});continue;
    }
    log('重複匯入但輸出已遺失，保留：'+filename);continue;
   }
   let artistId=findArtist(artists,p.artistName);
   if(!artistId){
    artistId='artist-'+sha(p.artistName).slice(0,10);
    if(artists[artistId]){log('繪師 ID 衝突，保留：'+filename);continue;}
    artistsSrc=addArtist(artistsSrc,artistId,p.artistName);
    writeSafe(ARTISTS,artistsSrc);artists=readFresh(ARTISTS).artists;
    log('新增繪師：'+p.artistName+'（社群連結可日後補充）');
   }
   const resolved=resolveMatch(works,p,artistId,history);
   if(resolved.ambiguous){log(`存在 ${resolved.ambiguous.length} 筆同角色、繪師、日期作品，差分無法確定對應，保留：${filename}（候選：${resolved.ambiguous.join('、')}）`);continue;}
   const id=`art-${p.date.slice(2).replaceAll('-','')}-${sha(filename+'|'+hash).slice(0,9)}`;
   const image=`images/${id}.jpg`;
   if(works.some(w=>w.id===id||w.image===image)){log('ID / 圖片路徑衝突，保留：'+filename);continue;}
   await exportImages(source,id);
   const now=fs.statSync(source);
   if(now.size!==stat.size||now.mtimeMs!==stat.mtimeMs||hashFile(source)!==hash){log('來源檔案尚在變動，保留：'+filename);continue;}
   if(resolved.work){
    worksSrc=updateFields(worksSrc,resolved.work.id,{id,image});
    log(`比對到舊作品，保留標題/手機位置/公開狀態，只更新 ID 和圖片：${resolved.work.id} → ${id}`);
   }else{
    worksSrc=addWork(worksSrc,{id,title:'',date:p.date,character:p.character,artist:artistId,published:false,image,mobilePosition:50});
    log(`新作品草稿：${p.character}／${p.artistName}／${p.date} → ${id}`);
   }
   writeSafe(WORKS,worksSrc);works=readFresh(WORKS).works;
   history.files.push({filename,hash,id,date:p.date,character:p.character,artist:artistId,variantNumber:p.variantNumber,publishedOnce:!!resolved.work?.published});
   writeHistory(history);
   completed.push({source,stat,hash,filename});
  }
  // 僅對監看工具建立的草稿啟用填標題即自動公開；不干涉手動下架的舊作品。
  let hasChange=false;
  for(const record of history.files){
   const w=works.find(x=>x.id===record.id);
   if(!w)continue;
   if(w.published===true&&!record.publishedOnce){record.publishedOnce=true;hasChange=true;}
   if(record.publishedOnce||w.published===true||!String(w.title||'').trim())continue;
   worksSrc=updateFields(worksSrc,w.id,{published:true});
   record.publishedOnce=true;hasChange=true;
   log('填入標題後自動公開：'+w.id);
  }
  if(hasChange){writeSafe(WORKS,worksSrc);writeHistory(history);works=readFresh(WORKS).works;}
  const key=sha(worksSrc+'\0'+artistsSrc);
  let built=key===lastBuild;
  if(!built){
   const errors=valid(works,artists);
   if(errors.length){const msg=errors.join('；');if(lastError!==msg)log('暫停作品頁生成：'+msg);lastError=msg;}
   else{
    const child=spawnSync(process.execPath,[GENERATOR],{cwd:ROOT,encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});
    if(child.status===0){lastBuild=key;built=true;lastError='';log(`作品頁已更新：${works.filter(w=>w.published).length} 件`);}
    else log('作品頁生成失敗，來源原圖保留：'+(child.stderr||child.stdout||child.error?.message||'未知錯誤').trim());
   }
  }
  if(built){
   for(const c of completed){
    if(!fs.existsSync(c.source))continue;
    const now=fs.statSync(c.source);
    if(now.size!==c.stat.size||now.mtimeMs!==c.stat.mtimeMs||hashFile(c.source)!==c.hash)continue;
    fs.unlinkSync(c.source);
    log('匯入成功，已刪除匯入副本：'+c.filename);
   }
  }
 }finally{busy=false;if(again){again=false;schedule(400);}}
}
for(const f of [WORKS,ARTISTS,GENERATOR])if(!fs.existsSync(f)){console.error('找不到：'+path.relative(ROOT,f));process.exit(1);}
fs.mkdirSync(INBOX,{recursive:true});fs.mkdirSync(THUMBS,{recursive:true});
const once=process.argv.includes('--once');
log('自動匯入 v4：先比對舊作品，成功後才清除匯入副本。');
if(!once){
 try{fs.watch(INBOX,()=>schedule(2500));fs.watch(path.dirname(WORKS),()=>schedule(1200));}
 catch(e){log('檔案監看不可用，改用定時掃描：'+e.message);}
 setInterval(()=>schedule(0),3500);
}
scan().catch(e=>{console.error(e);if(once)process.exitCode=1;});
