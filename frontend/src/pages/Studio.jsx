// import React,{useEffect,useState} from 'react';
// import {Link,useLocation,useNavigate} from 'react-router-dom';
// import {CalendarDays,Users,Layers3,ShieldCheck,ScrollText,Plus,RefreshCw,CheckCircle2,XCircle,Clock3,Trash2,LogOut} from 'lucide-react';
// import API from '../services/api';import {Navbar} from '../components/Navbar';import {useAuth} from '../context/AuthContext';
// const tabs=[['bookings','Bookings',CalendarDays],['customers','Customers',Users],['services','Services',Layers3],['availability','Availability',CalendarDays],['admins','Admins',ShieldCheck],['audit','Audit',ScrollText]];
// export const Studio=()=>{const {isAuthenticated,role}=useAuth();const nav=useNavigate();const loc=useLocation();const [data,setData]=useState([]);const [busy,setBusy]=useState(false);const [modal,setModal]=useState(null);const [form,setForm]=useState({});useEffect(()=>{if(!isAuthenticated)nav('/login')},[isAuthenticated]);const tab=loc.pathname.split('/')[2]||'bookings';
//  const load=async()=>{setBusy(true);try{let url=tab==='bookings'?'/bookings':tab==='customers'?'/customers':tab==='services'?'/services':tab==='availability'?'/availability':tab==='admins'?'/admins':'/admins/audit/logs';const r=await API.get(url);setData(r.data||[])}catch(e){setData([])}finally{setBusy(false)}};useEffect(()=>{if(isAuthenticated)load()},[tab,isAuthenticated]);
//  const saveService=async()=>{try{const payload={name:form.name,slug:form.slug,description:form.description,active:true,subServices:[],addOns:[]};await API.post('/services',payload);setModal(null);load()}catch(e){alert(e.response?.data?.msg||'Could not save service.')}};
//  const saveAdmin=async()=>{try{await API.post('/admins',form);setModal(null);load()}catch(e){alert(e.response?.data?.msg||'Could not create admin.')}};
//  const statusBooking=async(b,status)=>{try{await API.put(`/bookings/${b._id}`,{status});load()}catch(e){alert(e.response?.data?.msg||'Could not update booking.')}};
//  if(!isAuthenticated)return null;return <div className="endless-page min-h-screen"><Navbar/><main className="endless-shell py-10"><div className="flex flex-col lg:flex-row justify-between gap-5 border-b border-[#ded8cd] pb-7"><div><p className="text-[10px] uppercase tracking-[.35em] text-[#9a6845] font-bold">Studio management</p><h1 className="endless-serif text-5xl mt-2">Operations desk.</h1><p className="text-sm text-[#77766f] mt-2">Bookings, customers, configurable services and administrator controls.</p></div><button onClick={load} className="self-start rounded-full border border-[#d5cec2] bg-white px-4 py-3 text-sm font-bold flex gap-2"><RefreshCw size={15} className={busy?'animate-spin':''}/> Refresh</button></div>
//  <div className="flex overflow-auto gap-2 my-7">{tabs.map(([id,label,I])=><Link key={id} to={`/dashboard/${id}`} className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold flex items-center gap-2 ${tab===id?'bg-[#1f211e] text-white':'bg-[#ebe5db]'}`}><I size={14}/>{label}</Link>)}</div>
//  {tab==='bookings'&&<Bookings data={data} onStatus={statusBooking}/>} {tab==='customers'&&<Customers data={data} load={load}/>} {tab==='services'&&<Services data={data} onAdd={()=>{setForm({});setModal('service')}} load={load} onEdit={x=>{setForm({...x,subServices:x.subServices||[],packages:x.packages||[],addOns:x.addOns||[]});setModal('service-edit')}}/>} {tab==='availability'&&<Availability load={load} data={data}/>} {tab==='admins'&&<Admins data={data} role={role} onAdd={()=>{setForm({});setModal('admin')}} load={load}/>} {tab==='audit'&&<Audit data={data}/>} 
//  </main>{modal==='service'&&<Modal title="Add service" onClose={()=>setModal(null)}><Field label="Service name" v={form.name||''} set={v=>setForm({...form,name:v})}/><Field label="Slug" v={form.slug||''} set={v=>setForm({...form,slug:v})}/><Field label="Description" v={form.description||''} set={v=>setForm({...form,description:v})}/><button onClick={saveService} className="rounded-full bg-[#1f211e] text-white px-5 py-3 font-bold">Create service</button></Modal>}{modal==='service-edit'&&<Modal title="Edit service data" onClose={()=>setModal(null)}><Field label="Service name" v={form.name||''} set={v=>setForm({...form,name:v})}/><Field label="Slug" v={form.slug||''} set={v=>setForm({...form,slug:v})}/><Field label="Description" v={form.description||''} set={v=>setForm({...form,description:v})}/><JsonField label="Sub-services / option groups / options" value={JSON.stringify(form.subServices||[],null,2)} set={v=>{try{setForm({...form,subServices:JSON.parse(v)})}catch{setForm({...form,_subServicesText:v})}}}/><JsonField label="Packages" value={JSON.stringify(form.packages||[],null,2)} set={v=>{try{setForm({...form,packages:JSON.parse(v)})}catch{setForm({...form,_packagesText:v})}}}/><JsonField label="Add-ons" value={JSON.stringify(form.addOns||[],null,2)} set={v=>{try{setForm({...form,addOns:JSON.parse(v)})}catch{setForm({...form,_addOnsText:v})}}}/><button onClick={async()=>{try{await API.put(`/services/${form._id}`,{name:form.name,slug:form.slug,description:form.description,subServices:form.subServices||[],packages:form.packages||[],addOns:form.addOns||[],active:form.active!==false});setModal(null);load()}catch(e){alert(e.response?.data?.msg||'Could not update service.')}}} className="rounded-full bg-[#1f211e] text-white px-5 py-3 font-bold">Save service data</button></Modal>}{modal==='admin'&&<Modal title="Create normal admin" onClose={()=>setModal(null)}><Field label="Email" v={form.email||''} set={v=>setForm({...form,email:v})}/><Field label="Temporary password" v={form.password||''} set={v=>setForm({...form,password:v})}/><button onClick={saveAdmin} className="rounded-full bg-[#1f211e] text-white px-5 py-3 font-bold">Create admin</button></Modal>}</div>};
// const Bookings=({data,onStatus})=><div className="space-y-3">{data.length===0?<Empty text="No booking requests yet."/>:data.map(b=><div key={b._id} className="endless-card rounded-2xl p-5"><div className="flex flex-col lg:flex-row justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><span className="font-bold">{b.bookingId}</span><span className="text-[10px] uppercase tracking-wider rounded-full bg-[#eee8de] px-3 py-1 font-bold">{b.status}</span>{b.conflict&&<span className="text-[10px] uppercase tracking-wider rounded-full bg-amber-100 px-3 py-1 font-bold">Conflict request</span>}</div><h3 className="text-lg font-bold mt-3">{b.service?.name} · {b.subService?.name||'General'}</h3><p className="text-sm text-[#77766f] mt-1">{b.customer?.name} · {b.customer?.phone} · {b.event?.date} · {b.event?.startTime}–{b.event?.endTime}</p><p className="text-sm text-[#5e5d58] mt-3">{b.event?.location||'Location not specified'}{b.event?.city?`, ${b.event.city}`:''}</p></div><div className="flex flex-wrap gap-2 items-start">{['UNDER_REVIEW','QUOTED','CONFIRMED','COMPLETED','REJECTED','CANCELLED'].map(s=><button key={s} onClick={()=>onStatus(b,s)} className="rounded-full border border-[#d9d2c6] px-3 py-2 text-[10px] font-bold">{s.replace('_',' ')}</button>)}</div></div></div>)}</div>;
// const Customers=({data,load})=><div className="endless-card rounded-2xl overflow-hidden"><Table heads={['Name','Email','Phone','City','Status','Action']} rows={data.map(x=>[x.name,x.email,x.phone,x.city||'—',x.active===false?'Archived':'Active',<button onClick={async()=>{if(confirm(`Archive ${x.name}?`)){await API.delete(`/customers/${x._id}`);load()}}} className="text-red-600"><Trash2 size={15}/></button>])}/></div>;
// const Services=({data,onAdd,onEdit,load})=><div><div className="flex justify-end mb-4"><button onClick={onAdd} className="rounded-full bg-[#1f211e] text-white px-5 py-3 text-sm font-bold flex gap-2"><Plus size={15}/> Add service</button></div><div className="grid md:grid-cols-2 gap-3">{data.map(s=><div key={s._id} className="endless-card rounded-2xl p-5"><div className="flex justify-between gap-3"><div><h3 className="font-bold">{s.name}</h3><p className="text-xs text-[#9a6845] mt-1">{s.active===false?'Inactive':'Active'}</p></div><div className="flex gap-2"><button onClick={()=>onEdit(s)} className="rounded-full border px-3 py-2 text-xs font-bold">Edit data</button><button onClick={async()=>{if(confirm(`Deactivate ${s.name}?`)){await API.delete(`/services/${s._id}`);load()}}} className="rounded-full border border-red-200 text-red-600 px-3 py-2 text-xs font-bold">Deactivate</button></div></div><p className="text-sm text-[#77766f] mt-3">{s.description||'No description'}</p><p className="text-xs mt-4">{s.subServices?.length||0} sub-services · {s.packages?.length||0} packages · {s.addOns?.length||0} add-ons</p></div>)}</div></div>;

// const Availability=({data,load})=>{const [f,setF]=useState({date:'',startTime:'',endTime:'',note:''});return <div><div className="endless-card rounded-2xl p-5 mb-5"><h2 className="font-bold">Block a date or time</h2><div className="grid sm:grid-cols-4 gap-3 mt-4"><input type="date" value={f.date} onChange={e=>setF({...f,date:e.target.value})} className="field"/><input type="time" value={f.startTime} onChange={e=>setF({...f,startTime:e.target.value})} className="field"/><input type="time" value={f.endTime} onChange={e=>setF({...f,endTime:e.target.value})} className="field"/><button onClick={async()=>{if(!f.date)return;await API.post('/availability',f);setF({date:'',startTime:'',endTime:'',note:''});load()}} className="rounded-full bg-[#1f211e] text-white px-4 py-3 text-sm font-bold">Block</button></div><input placeholder="Internal note" value={f.note} onChange={e=>setF({...f,note:e.target.value})} className="field mt-3"/></div><div className="endless-card rounded-2xl overflow-hidden"><Table heads={['Date','Time','Type','Note','Action']} rows={data.map(x=>[x.date,x.startTime&&x.endTime?`${x.startTime}–${x.endTime}`:'All day',x.type||'BLOCKED',x.note||'—',<button onClick={async()=>{await API.delete(`/availability/${x._id}`);load()}} className="text-red-600"><Trash2 size={15}/></button>])}/></div></div>;

// const Admins=({data,role,onAdd,load})=><div><div className="flex justify-between mb-4"><p className="text-sm text-[#77766f]">Master Admin controls administrator lifecycle. Normal admins cannot delete other admins.</p>{role==='master_admin'&&<button onClick={onAdd} className="rounded-full bg-[#1f211e] text-white px-5 py-3 text-sm font-bold flex gap-2"><Plus size={15}/> Add admin</button>}</div><div className="endless-card rounded-2xl overflow-hidden"><Table heads={['Email','Role','Status','Created by','Actions']} rows={data.map(x=>[x.email,x.role,x.active===false?'Inactive':'Active',x.createdBy||'System',role==='master_admin'&&x.role!=='master_admin'?<button onClick={async()=>{if(confirm(`Deactivate ${x.email}?`)){await API.delete(`/admins/${x._id}`);load()}}} className="text-red-600"><Trash2 size={15}/></button>:<span>Protected</span>])}/></div></div>;
// const Audit=({data})=><div className="endless-card rounded-2xl overflow-hidden"><Table heads={['Time','Actor','Action','Target','Description']} rows={data.map(x=>[new Date(x.createdAt).toLocaleString(),x.actorEmail,x.action,`${x.targetType}:${x.targetId}`,x.description])}/></div>;
// const JsonField=({label,value,set})=><label className="block mb-4"><span className="field-label">{label}</span><textarea rows="8" value={value} onChange={e=>set(e.target.value)} className="field font-mono text-xs"/></label>;const Table=({heads,rows})=><div className="overflow-auto"><table className="w-full text-sm"><thead><tr className="bg-[#eee8de] text-left">{heads.map(h=><th key={h} className="px-4 py-3 text-[10px] uppercase tracking-wider">{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i} className="border-t border-[#eee9e1]">{r.map((c,j)=><td key={j} className="px-4 py-4 whitespace-nowrap">{c}</td>)}</tr>)}</tbody></table></div>;
// const Empty=({text})=><div className="endless-card rounded-2xl p-16 text-center text-[#77766f]">{text}</div>;const Field=({label,v,set})=><label className="block mb-4"><span className="field-label">{label}</span><input value={v} onChange={e=>set(e.target.value)} className="field"/></label>;const Modal=({title,onClose,children})=><div className="fixed inset-0 z-50 bg-black/50 p-4 grid place-items-center"><div className="w-full max-w-lg bg-[#f6f2eb] rounded-3xl p-7"><div className="flex justify-between mb-6"><h2 className="endless-serif text-3xl">{title}</h2><button onClick={onClose}><X/></button></div>{children}</div></div>;

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  Layers3,
  ShieldCheck,
  ScrollText,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';
import API from '../services/api';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const tabs = [
  ['bookings', 'Bookings', CalendarDays],
  ['customers', 'Customers', Users],
  ['services', 'Services', Layers3],
  ['availability', 'Availability', CalendarDays],
  ['admins', 'Admins', ShieldCheck],
  ['audit', 'Audit', ScrollText],
];

export const Studio = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const tab = location.pathname.split('/')[2] || 'bookings';

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const load = async () => {
    setBusy(true);
    try {
      const url =
        tab === 'bookings'
          ? '/bookings'
          : tab === 'customers'
            ? '/customers'
            : tab === 'services'
              ? '/services'
              : tab === 'availability'
                ? '/availability'
                : tab === 'admins'
                  ? '/admins'
                  : '/admins/audit/logs';
      const response = await API.get(url);
      setData(response.data || []);
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) load();
  }, [tab, isAuthenticated]);

  const saveService = async () => {
    try {
      await API.post('/services', {
        name: form.name,
        slug: form.slug,
        description: form.description,
        active: true,
        subServices: [],
        packages: [],
        addOns: [],
      });
      setModal(null);
      load();
    } catch (error) {
      alert(error.response?.data?.msg || 'Could not save service.');
    }
  };

  const saveAdmin = async () => {
    try {
      await API.post('/admins', form);
      setModal(null);
      load();
    } catch (error) {
      alert(error.response?.data?.msg || 'Could not create admin.');
    }
  };

  const statusBooking = async (booking, status) => {
    try {
      await API.put(`/bookings/${booking._id}`, { status });
      load();
    } catch (error) {
      alert(error.response?.data?.msg || 'Could not update booking.');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="endless-page min-h-screen">
      <Navbar />
      <main className="endless-shell py-10">
        <div className="flex flex-col lg:flex-row justify-between gap-5 border-b border-[#ded8cd] pb-7">
          <div>
            <p className="text-[10px] uppercase tracking-[.35em] text-[#9a6845] font-bold">
              Studio management
            </p>
            <h1 className="endless-serif text-5xl mt-2">Operations desk.</h1>
            <p className="text-sm text-[#77766f] mt-2">
              Bookings, customers, configurable services and administrator controls.
            </p>
          </div>
          <button
            onClick={load}
            className="self-start rounded-full border border-[#d5cec2] bg-white px-4 py-3 text-sm font-bold flex gap-2"
          >
            <RefreshCw size={15} className={busy ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="flex overflow-auto gap-2 my-7">
          {tabs.map(([id, label, Icon]) => (
            <Link
              key={id}
              to={`/dashboard/${id}`}
              className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold flex items-center gap-2 ${
                tab === id ? 'bg-[#1f211e] text-white' : 'bg-[#ebe5db]'
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </div>

        {tab === 'bookings' && <Bookings data={data} onStatus={statusBooking} />}
        {tab === 'customers' && <Customers data={data} load={load} />}
        {tab === 'services' && (
          <Services
            data={data}
            onAdd={() => {
              setForm({});
              setModal('service');
            }}
            onEdit={(service) => {
              setForm({
                ...service,
                subServices: service.subServices || [],
                packages: service.packages || [],
                addOns: service.addOns || [],
              });
              setModal('service-edit');
            }}
            load={load}
          />
        )}
        {tab === 'availability' && <Availability load={load} data={data} />}
        {tab === 'admins' && (
          <Admins
            data={data}
            role={role}
            onAdd={() => {
              setForm({});
              setModal('admin');
            }}
            load={load}
          />
        )}
        {tab === 'audit' && <Audit data={data} />}
      </main>

      {modal === 'service' && (
        <Modal title="Add service" onClose={() => setModal(null)}>
          <Field label="Service name" v={form.name || ''} set={(v) => setForm({ ...form, name: v })} />
          <Field label="Slug" v={form.slug || ''} set={(v) => setForm({ ...form, slug: v })} />
          <Field
            label="Description"
            v={form.description || ''}
            set={(v) => setForm({ ...form, description: v })}
          />
          <button
            onClick={saveService}
            className="rounded-full bg-[#1f211e] text-white px-5 py-3 font-bold"
          >
            Create service
          </button>
        </Modal>
      )}

      {modal === 'service-edit' && (
        <Modal title="Edit service data" onClose={() => setModal(null)}>
          <Field label="Service name" v={form.name || ''} set={(v) => setForm({ ...form, name: v })} />
          <Field label="Slug" v={form.slug || ''} set={(v) => setForm({ ...form, slug: v })} />
          <Field
            label="Description"
            v={form.description || ''}
            set={(v) => setForm({ ...form, description: v })}
          />
          <JsonField
            label="Sub-services / option groups / options"
            value={JSON.stringify(form.subServices || [], null, 2)}
            set={(value) => {
              try {
                setForm({ ...form, subServices: JSON.parse(value) });
              } catch {
                setForm({ ...form, _subServicesText: value });
              }
            }}
          />
          <JsonField
            label="Packages"
            value={JSON.stringify(form.packages || [], null, 2)}
            set={(value) => {
              try {
                setForm({ ...form, packages: JSON.parse(value) });
              } catch {
                setForm({ ...form, _packagesText: value });
              }
            }}
          />
          <JsonField
            label="Add-ons"
            value={JSON.stringify(form.addOns || [], null, 2)}
            set={(value) => {
              try {
                setForm({ ...form, addOns: JSON.parse(value) });
              } catch {
                setForm({ ...form, _addOnsText: value });
              }
            }}
          />
          <button
            onClick={async () => {
              try {
                await API.put(`/services/${form._id}`, {
                  name: form.name,
                  slug: form.slug,
                  description: form.description,
                  subServices: form.subServices || [],
                  packages: form.packages || [],
                  addOns: form.addOns || [],
                  active: form.active !== false,
                });
                setModal(null);
                load();
              } catch (error) {
                alert(error.response?.data?.msg || 'Could not update service.');
              }
            }}
            className="rounded-full bg-[#1f211e] text-white px-5 py-3 font-bold"
          >
            Save service data
          </button>
        </Modal>
      )}

      {modal === 'admin' && (
        <Modal title="Create normal admin" onClose={() => setModal(null)}>
          <Field label="Email" v={form.email || ''} set={(v) => setForm({ ...form, email: v })} />
          <Field
            label="Temporary password"
            v={form.password || ''}
            set={(v) => setForm({ ...form, password: v })}
          />
          <button
            onClick={saveAdmin}
            className="rounded-full bg-[#1f211e] text-white px-5 py-3 font-bold"
          >
            Create admin
          </button>
        </Modal>
      )}
    </div>
  );
};

const Bookings = ({ data, onStatus }) => (
  <div className="space-y-3">
    {data.length === 0 ? (
      <Empty text="No booking requests yet." />
    ) : (
      data.map((booking) => (
        <div key={booking._id} className="endless-card rounded-2xl p-5">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold">{booking.bookingId}</span>
                <span className="text-[10px] uppercase tracking-wider rounded-full bg-[#eee8de] px-3 py-1 font-bold">
                  {booking.status}
                </span>
                {booking.conflict && (
                  <span className="text-[10px] uppercase tracking-wider rounded-full bg-amber-100 px-3 py-1 font-bold">
                    Conflict request
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold mt-3">
                {booking.service?.name} · {booking.subService?.name || 'General'}
              </h3>
              <p className="text-sm text-[#77766f] mt-1">
                {booking.customer?.name} · {booking.customer?.phone} · {booking.event?.date} ·{' '}
                {booking.event?.startTime}–{booking.event?.endTime}
              </p>
              <p className="text-sm text-[#5e5d58] mt-3">
                {booking.event?.location || 'Location not specified'}
                {booking.event?.city ? `, ${booking.event.city}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-start">
              {['UNDER_REVIEW', 'QUOTED', 'CONFIRMED', 'COMPLETED', 'REJECTED', 'CANCELLED'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => onStatus(booking, status)}
                    className="rounded-full border border-[#d9d2c6] px-3 py-2 text-[10px] font-bold"
                  >
                    {status.replace('_', ' ')}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

const Customers = ({ data, load }) => (
  <div className="endless-card rounded-2xl overflow-hidden">
    <Table
      heads={['Name', 'Email', 'Phone', 'City', 'Status', 'Action']}
      rows={data.map((customer) => [
        customer.name,
        customer.email,
        customer.phone,
        customer.city || '—',
        customer.active === false ? 'Archived' : 'Active',
        <button
          key={customer._id}
          onClick={async () => {
            if (confirm(`Archive ${customer.name}?`)) {
              await API.delete(`/customers/${customer._id}`);
              load();
            }
          }}
          className="text-red-600"
        >
          <Trash2 size={15} />
        </button>,
      ])}
    />
  </div>
);

const Services = ({ data, onAdd, onEdit, load }) => (
  <div>
    <div className="flex justify-end mb-4">
      <button
        onClick={onAdd}
        className="rounded-full bg-[#1f211e] text-white px-5 py-3 text-sm font-bold flex gap-2"
      >
        <Plus size={15} /> Add service
      </button>
    </div>
    <div className="grid md:grid-cols-2 gap-3">
      {data.map((service) => (
        <div key={service._id} className="endless-card rounded-2xl p-5">
          <div className="flex justify-between gap-3">
            <div>
              <h3 className="font-bold">{service.name}</h3>
              <p className="text-xs text-[#9a6845] mt-1">
                {service.active === false ? 'Inactive' : 'Active'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(service)}
                className="rounded-full border px-3 py-2 text-xs font-bold"
              >
                Edit data
              </button>
              <button
                onClick={async () => {
                  if (confirm(`Deactivate ${service.name}?`)) {
                    await API.delete(`/services/${service._id}`);
                    load();
                  }
                }}
                className="rounded-full border border-red-200 text-red-600 px-3 py-2 text-xs font-bold"
              >
                Deactivate
              </button>
            </div>
          </div>
          <p className="text-sm text-[#77766f] mt-3">
            {service.description || 'No description'}
          </p>
          <p className="text-xs mt-4">
            {service.subServices?.length || 0} sub-services · {service.packages?.length || 0}{' '}
            packages · {service.addOns?.length || 0} add-ons
          </p>
        </div>
      ))}
    </div>
  </div>
);

const Availability = ({ data, load }) => {
  const [form, setForm] = useState({ date: '', startTime: '', endTime: '', note: '' });

  return (
    <div>
      <div className="endless-card rounded-2xl p-5 mb-5">
        <h2 className="font-bold">Block a date or time</h2>
        <div className="grid sm:grid-cols-4 gap-3 mt-4">
          <input
            type="date"
            value={form.date}
            onChange={(event) => setForm({ ...form, date: event.target.value })}
            className="field"
          />
          <input
            type="time"
            value={form.startTime}
            onChange={(event) => setForm({ ...form, startTime: event.target.value })}
            className="field"
          />
          <input
            type="time"
            value={form.endTime}
            onChange={(event) => setForm({ ...form, endTime: event.target.value })}
            className="field"
          />
          <button
            onClick={async () => {
              if (!form.date) return;
              await API.post('/availability', form);
              setForm({ date: '', startTime: '', endTime: '', note: '' });
              load();
            }}
            className="rounded-full bg-[#1f211e] text-white px-4 py-3 text-sm font-bold"
          >
            Block
          </button>
        </div>
        <input
          placeholder="Internal note"
          value={form.note}
          onChange={(event) => setForm({ ...form, note: event.target.value })}
          className="field mt-3"
        />
      </div>
      <div className="endless-card rounded-2xl overflow-hidden">
        <Table
          heads={['Date', 'Time', 'Type', 'Note', 'Action']}
          rows={data.map((item) => [
            item.date,
            item.startTime && item.endTime ? `${item.startTime}–${item.endTime}` : 'All day',
            item.type || 'BLOCKED',
            item.note || '—',
            <button
              key={item._id}
              onClick={async () => {
                await API.delete(`/availability/${item._id}`);
                load();
              }}
              className="text-red-600"
            >
              <Trash2 size={15} />
            </button>,
          ])}
        />
      </div>
    </div>
  );
};

const Admins = ({ data, role, onAdd, load }) => (
  <div>
    <div className="flex justify-between mb-4">
      <p className="text-sm text-[#77766f]">
        Master Admin controls administrator lifecycle. Normal admins cannot delete other admins.
      </p>
      {role === 'master_admin' && (
        <button
          onClick={onAdd}
          className="rounded-full bg-[#1f211e] text-white px-5 py-3 text-sm font-bold flex gap-2"
        >
          <Plus size={15} /> Add admin
        </button>
      )}
    </div>
    <div className="endless-card rounded-2xl overflow-hidden">
      <Table
        heads={['Email', 'Role', 'Status', 'Created by', 'Actions']}
        rows={data.map((admin) => [
          admin.email,
          admin.role,
          admin.active === false ? 'Inactive' : 'Active',
          admin.createdBy || 'System',
          role === 'master_admin' && admin.role !== 'master_admin' ? (
            <button
              key={admin._id}
              onClick={async () => {
                if (confirm(`Deactivate ${admin.email}?`)) {
                  await API.delete(`/admins/${admin._id}`);
                  load();
                }
              }}
              className="text-red-600"
            >
              <Trash2 size={15} />
            </button>
          ) : (
            <span key={admin._id}>Protected</span>
          ),
        ])}
      />
    </div>
  </div>
);

const Audit = ({ data }) => (
  <div className="endless-card rounded-2xl overflow-hidden">
    <Table
      heads={['Time', 'Actor', 'Action', 'Target', 'Description']}
      rows={data.map((item) => [
        new Date(item.createdAt).toLocaleString(),
        item.actorEmail,
        item.action,
        `${item.targetType}:${item.targetId}`,
        item.description,
      ])}
    />
  </div>
);

const JsonField = ({ label, value, set }) => (
  <label className="block mb-4">
    <span className="field-label">{label}</span>
    <textarea
      rows="8"
      value={value}
      onChange={(event) => set(event.target.value)}
      className="field font-mono text-xs"
    />
  </label>
);

const Table = ({ heads, rows }) => (
  <div className="overflow-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-[#eee8de] text-left">
          {heads.map((head) => (
            <th key={head} className="px-4 py-3 text-[10px] uppercase tracking-wider">
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-t border-[#eee9e1]">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="px-4 py-4 whitespace-nowrap">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Empty = ({ text }) => (
  <div className="endless-card rounded-2xl p-16 text-center text-[#77766f]">{text}</div>
);

const Field = ({ label, v, set }) => (
  <label className="block mb-4">
    <span className="field-label">{label}</span>
    <input value={v} onChange={(event) => set(event.target.value)} className="field" />
  </label>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 bg-black/50 p-4 grid place-items-center">
    <div className="w-full max-w-lg bg-[#f6f2eb] rounded-3xl p-7 max-h-[90vh] overflow-auto">
      <div className="flex justify-between mb-6">
        <h2 className="endless-serif text-3xl">{title}</h2>
        <button onClick={onClose} aria-label="Close">
          <X />
        </button>
      </div>
      {children}
    </div>
  </div>
);
