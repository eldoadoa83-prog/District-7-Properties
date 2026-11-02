import React, { useState } from 'react';

export default function App() {
  const [view, setView] = useState('home');

  // بيانات العميل الشخصية
  const [clientProfile, setClientProfile] = useState({
    name: '', phone: '', address: '', job: '', bio: 'باحث عن عقار مميز في الدلتا', avatar: 'https://via.placeholder.com/80'
  });

  // بيانات المطور الشخصية
  const [devProfile, setDevProfile] = useState({
    company: '', devAddress: '', devPhone: '', bio: 'شركة تطور عقاري رائدة', logo: 'https://via.placeholder.com/80'
  });

  const [allClients, setAllClients] = useState([
    { name: 'د. أحمد مبروك', phone: '01012345678', address: 'دمياط الجديدة', job: 'صيدلي', date: '2026-11-02' }
  ]);

  const [allDevelopers, setAllDevelopers] = useState([
    { company: 'شركة التضامن', phone: '01098765432', address: 'المنصورة الجديدة', bio: 'استثمار عقاري وتجاري', date: '2026-11-02' }
  ]);

  const [requests, setRequests] = useState([
    { id: 1, code: 'طلب #101', clientName: 'د. أحمد مبروك', phone: '01012345678', avatar: 'https://via.placeholder.com/40', type: 'تجاري', city: 'دمياط الجديدة', space: '60 متر', budget: '2,500,000 ج', details: 'صيدلية بالداون تاون', offers: [] }
  ]);

  const [units, setUnits] = useState([
    { id: 1, dev: 'شركة التضامن', logo: 'https://via.placeholder.com/40', project: 'مول الداون تاون', type: 'تجاري', city: 'دمياط الجديدة', space: '55 متر', price: 2500000, downPct: 10, years: 7, details: 'موقع حيوي واجهة مباشرة' }
  ]);

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [newReq, setNewReq] = useState({ type: 'تجاري', city: 'دمياط الجديدة', space: '', budget: '', details: '' });
  const [newUnit, setNewUnit] = useState({ project: '', type: 'تجاري', city: 'دمياط الجديدة', space: '', price: '', downPct: '10', years: '7', details: '' });

  const [clientNotifs, setClientNotifs] = useState([{ text: 'أهلاً بك في منصة District 7 العقارية.', time: 'الآن', unread: true }]);
  const [devNotifs, setDevNotifs] = useState([{ text: 'تم تفعيل حساب شركتك بنجاح.', time: 'الآن', unread: true }]);

  const [showClientNotifMenu, setShowClientNotifMenu] = useState(false);
  const [showDevNotifMenu, setShowDevNotifMenu] = useState(false);

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'client') {
          setClientProfile({ ...clientProfile, avatar: reader.result });
        } else {
          setDevProfile({ ...devProfile, logo: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const calcInstallment = (price, downPct, years) => {
    const p = parseFloat(price) || 0;
    const down = (p * downPct) / 100;
    const remaining = p - down;
    const quarters = (parseInt(years) || 0) * 4;
    const quarterly = quarters > 0 ? remaining / quarters : 0;
    return { down, quarterly, quarters };
  };

  const handleClientRegister = () => {
    if (!clientProfile.name) return alert('برجاء كتابة الاسم الكريم');
    if (!validatePhone(clientProfile.phone)) {
      return alert('❌ خطأ: رقم الهاتف غير صحيح أو غير متكامل! يجب ألا يقل عن 10 أرقام.');
    }
    const exists = allClients.some(c => c.phone === clientProfile.phone);
    if (!exists) {
      setAllClients([...allClients, { ...clientProfile, date: new Date().toLocaleDateString() }]);
    }
    setView('client-dash');
  };

  const handleDevRegister = () => {
    if (!devProfile.company) return alert('برجاء كتابة اسم الشركة');
    if (!validatePhone(devProfile.devPhone)) {
      return alert('❌ خطأ: رقم هاتف الشركة غير صحيح! يجب ألا يقل عن 10 أرقام.');
    }
    const exists = allDevelopers.some(d => d.phone === devProfile.devPhone);
    if (!exists) {
      setAllDevelopers([...allDevelopers, { company: devProfile.company, phone: devProfile.devPhone, address: devProfile.devAddress, bio: devProfile.bio, date: new Date().toLocaleDateString() }]);
    }
    setView('dev-dash');
  };

  const handleAddReq = (e) => {
    e.preventDefault();
    if (!newReq.budget) return alert('برجاء إدخال الميزانية');
    const req = {
      id: Date.now(),
      code: `طلب #${Math.floor(100 + Math.random()*900)}`,
      clientName: clientProfile.name,
      phone: clientProfile.phone,
      avatar: clientProfile.avatar,
      ...newReq,
      offers: []
    };
    setRequests([req, ...requests]);
    setClientNotifs([{ text: `تم نشر طلبك (${req.code}) بنجاح.`, time: 'الآن', unread: true }, ...clientNotifs]);
    setNewReq({ type: 'تجاري', city: 'دمياط الجديدة', space: '', budget: '', details: '' });
    alert('تم إضافة الطلب بنجاح وإرساله للوسيط!');
  };

  const handleAddUnit = (e) => {
    e.preventDefault();
    if (!newUnit.project || !newUnit.price) return alert('برجاء إدخال اسم المشروع والسعر');
    const unit = {
      id: Date.now(),
      dev: devProfile.company,
      logo: devProfile.logo,
      ...newUnit,
      price: parseFloat(newUnit.price),
      downPct: parseFloat(newUnit.downPct),
      years: parseInt(newUnit.years)
    };
    setUnits([unit, ...units]);
    setDevNotifs([{ text: `تم نشر وحدتك في مشروع (${newUnit.project}) بنجاح.`, time: 'الآن', unread: true }, ...devNotifs]);
    setNewUnit({ project: '', type: 'تجاري', city: 'دمياط الجديدة', space: '', price: '', downPct: '10', years: '7', details: '' });
    alert('تم نشر الوحدة بنجاح!');
  };

  const handleBookInspection = (unit) => {
    setClientNotifs([{ text: `تم إرسال طلب المعاينة للوسيط (عصام) على عقار (${unit.project}) وسيتواصل معك قريباً.`, time: 'الآن', unread: true }, ...clientNotifs]);
    alert('تم إرسال طلب الحجز والمعاينة للوسيط (عصام) بنجاح!');
  };

  const handleSendOffer = (reqId, unit) => {
    setRequests(requests.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          offers: [...r.offers, { dev: devProfile.company, logo: devProfile.logo, unitTitle: unit.project, price: unit.price }]
        };
      }
      return r;
    }));
    alert('تم إرسال عرضك للوسيط (عصام) لمراجعته وإحالته للعميل!');
  };

  const handleForwardOfferToClient = (req, offer) => {
    setClientNotifs([{ text: `🎉 عرض جديد وصلك من المطور (${offer.dev}) على عقار (${offer.unitTitle}) بسعر ${offer.price.toLocaleString()} ج`, time: 'الآن', unread: true }, ...clientNotifs]);
    alert(`تم إحالة العرض بنجاح وإرسال إشعار فوري للعميل ${req.clientName}!`);
  };

  const exportToExcel = (data, fileName) => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    if (fileName === 'clients') {
      csvContent += "الاسم,الهاتف,العنوان,الوظيفة,تاريخ التسجيل\n";
      data.forEach(row => { csvContent += `${row.name},${row.phone},${row.address},${row.job},${row.date}\n`; });
    } else {
      csvContent += "اسم الشركة,الهاتف,العنوان,نبذة,تاريخ التسجيل\n";
      data.forEach(row => { csvContent += `${row.company},${row.phone},${row.address},${row.bio},${row.date}\n`; });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${fileName}_district7.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', color: '#1e293b', minHeight: '100vh', fontFamily: 'sans-serif', direction: 'rtl', padding: '0' }}>
      
      {/* Header - ستايل عصري راقي */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '15px 40px', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>District 7 <span style={{ color: '#2563eb' }}>Properties</span></h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>منصة الوساطة العقارية والربط الذكي - الدلتا</span>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          {view !== 'home' && <button onClick={() => setView('home')} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>الرئيسية</button>}
          <button onClick={() => setView('admin')} style={{ padding: '8px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>🔐 لوحة الوسيط والداتا</button>
        </div>
      </div>

      {/* Home - Hero Section (ستايل الشركات الكبرى) */}
      {view === 'home' && (
        <div>
          <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', color: '#fff', padding: '80px 20px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '36px', marginBottom: '15px' }}>اكتشف أفضل المشاريع العقارية في دمياط والمنصورة الجديدة</h1>
            <p style={{ fontSize: '16px', color: '#93c5fd', marginBottom: '40px' }}>منصة تجمع لك كبرى المطورين والفرص الاستثمارية تحت إشراف وسيط عقاري معتمد.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button onClick={() => setView('client-login')} style={{ padding: '15px 35px', background: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>تسجيل كعميل باحث عن عقار</button>
              <button onClick={() => setView('dev-login')} style={{ padding: '15px 35px', background: '#ffffff', color: '#1e3a8a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>دخول شركات التطوير العقاري</button>
            </div>
          </div>

          <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
            <h3 style={{ color: '#0f172a', borderBottom: '2px solid #2563eb', paddingBottom: '10px', display: 'inline-block' }}>أحدث المشاريع والعقارات المعروضة</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
              {units.map(u => (
                <div key={u.id} onClick={() => { setView('client-login'); }} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ background: '#eff6ff', padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={u.logo} alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ margin: '0', color: '#1e3a8a' }}>{u.project}</h4>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{u.dev} - {u.city}</span>
                    </div>
                  </div>
                  <div style={{ padding: '15px' }}>
                    <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 10px 0' }}>{u.details}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '16px' }}>{u.price.toLocaleString()} ج.م</span>
                      <span style={{ fontSize: '12px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>{u.space}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Client Login */}
      {view === 'client-login' && (
        <div style={{ maxWidth: '450px', margin: '40px auto', background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#1e3a8a', marginTop: 0 }}>تسجيل بيانات العميل</h3>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>يرجى إدخال رقم هاتف صحيح للمتابعة وتلقي عروض المطورين.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" placeholder="الاسم الكريم" value={clientProfile.name} onChange={e=>setClientProfile({...clientProfile, name: e.target.value})} style={{ padding: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }} />
            <input type="text" placeholder="رقم الهاتف (إجباري وصحيح 10 أرقام)" value={clientProfile.phone} onChange={e=>setClientProfile({...clientProfile, phone: e.target.value})} style={{ padding: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }} />
            <input type="text" placeholder="العنوان" value={clientProfile.address} onChange={e=>setClientProfile({...clientProfile, address: e.target.value})} style={{ padding: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }} />
            <input type="text" placeholder="الوظيفة" value={clientProfile.job} onChange={e=>setClientProfile({...clientProfile, job: e.target.value})} style={{ padding: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }} />
            
            <label style={{ fontSize: '12px', color: '#64748b' }}>رفع الصورة الشخصية:</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'client')} style={{ fontSize: '12px' }} />

            <button onClick={handleClientRegister} style={{ padding: '12px', background: '#2563eb', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>دخول الحساب واستعراض العقارات</button>
          </div>
        </div>
      )}

      {/* Dev Login */}
      {view === 'dev-login' && (
        <div style={{ maxWidth: '450px', margin: '40px auto', background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#1e3a8a', marginTop: 0 }}>تسجيل شركة التطوير العقاري</h3>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>أدخل بيانات شركتك ورقم تواصل صحيح.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" placeholder="اسم الشركة" value={devProfile.company} onChange={e=>setDevProfile({...devProfile, company: e.target.value})} style={{ padding: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }} />
            <input type="text" placeholder="رقم هاتف الشركة (إجباري)" value={devProfile.devPhone} onChange={e=>setDevProfile({...devProfile, devPhone: e.target.value})} style={{ padding: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }} />
            <input type="text" placeholder="عنوان الشركة" value={devProfile.devAddress} onChange={e=>setDevProfile({...devProfile, devAddress: e.target.value})} style={{ padding: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }} />
            
            <label style={{ fontSize: '12px', color: '#64748b' }}>رفع لوجو الشركة:</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'dev')} style={{ fontSize: '12px' }} />

            <button onClick={handleDevRegister} style={{ padding: '12px', background: '#1e3a8a', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>دخول لوحة المطورين</button>
          </div>
        </div>
      )}

      {/* Client Dashboard */}
      {view === 'client-dash' && (
        <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={clientProfile.avatar} alt="Profile" style={{ width: '55px', height: '55px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' }} />
              <div>
                <h3 style={{ margin: 0, color: '#0f172a' }}>{clientProfile.name}</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{clientProfile.job} | {clientProfile.address}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button onClick={() => setView('client-profile')} style={{ padding: '8px 14px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                👤 تعديل البروفايل
              </button>

              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowClientNotifMenu(!showClientNotifMenu)} style={{ padding: '8px 14px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  🔔 إشعارات ({clientNotifs.filter(n=>n.unread).length})
                </button>
                {showClientNotifMenu && (
                  <div style={{ position: 'absolute', left: 0, top: '45px', width: '300px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', zIndex: 10, boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#1e3a8a' }}>الإشعارات الواردة</h4>
                    {clientNotifs.map((n, i) => (
                      <div key={i} style={{ background: n.unread ? '#f8fafc' : '#ffffff', padding: '8px', borderRadius: '5px', marginBottom: '5px', fontSize: '11px', borderBottom: '1px solid #f1f5f9' }}>
                        <div>{n.text}</div>
                        <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '3px' }}>{n.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
            <div style={{ background: '#ffffff', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <h4 style={{ color: '#1e3a8a', marginTop: 0 }}>➕ إضافة طلب عقاري جديد للوسيط</h4>
              <form onSubmit={handleAddReq} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <select value={newReq.type} onChange={e=>setNewReq({...newReq, type: e.target.value})} style={{ padding: '10px', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                  <option value="تجاري">تجاري</option><option value="سكني">سكني</option><option value="طبي">طبي</option><option value="إداري">إداري</option>
                </select>
                <select value={newReq.city} onChange={e=>setNewReq({...newReq, city: e.target.value})} style={{ padding: '10px', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                  <option value="دمياط الجديدة">دمياط الجديدة</option><option value="المنصورة الجديدة">المنصورة الجديدة</option>
                </select>
                <input type="text" placeholder="المساحة المطلوبة" value={newReq.space} onChange={e=>setNewReq({...newReq, space: e.target.value})} style={{ padding: '10px', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <input type="text" placeholder="الميزانية المتاحة" value={newReq.budget} onChange={e=>setNewReq({...newReq, budget: e.target.value})} style={{ padding: '10px', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <textarea placeholder="تفاصيل إضافية..." value={newReq.details} onChange={e=>setNewReq({...newReq, details: e.target.value})} style={{ padding: '10px', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px' }}></textarea>
                <button type="submit" style={{ padding: '12px', background: '#2563eb', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>إرسال الطلب للوسيط</button>
              </form>
            </div>

            <div style={{ background: '#ffffff', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <h4 style={{ color: '#1e3a8a', marginTop: 0 }}>العقارات والمشاريع المتاحة (انقر للمعاينة)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {units.map(u => (
                  <div key={u.id} onClick={() => setSelectedUnit(u)} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img src={u.logo} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 'bold' }}>{u.dev}</div>
                      <h5 style={{ margin: '2px 0', color: '#0f172a' }}>{u.project} ({u.city})</h5>
                      <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 'bold' }}>{u.price.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedUnit && (
            <div style={{ background: '#ffffff', padding: '25px', borderRadius: '12px', border: '2px solid #2563eb', marginTop: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: '#1e3a8a', margin: 0 }}>تفاصيل عقار: {selectedUnit.project}</h3>
                <button onClick={() => setSelectedUnit(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}>إغلاق</button>
              </div>
              <p style={{ color: '#475569', margin: '10px 0' }}><b>المطور:</b> {selectedUnit.dev} | <b>الموقع:</b> {selectedUnit.city} | <b>المساحة:</b> {selectedUnit.space}</p>
              <p style={{ color: '#475569' }}><b>التفاصيل:</b> {selectedUnit.details || 'لا توجد تفاصيل إضافية.'}</p>
              <p style={{ fontSize: '16px' }}><b>السعر الإجمالي:</b> <span style={{ color: '#16a34a', fontWeight: 'bold' }}>{selectedUnit.price.toLocaleString()} ج.م</span></p>
              
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 'bold', color: '#1e3a8a', marginBottom: '5px' }}>💳 حاسبة الأقساط الميسرة (تسهيلات {selectedUnit.years} سنوات):</div>
                <div>• المقدم ({selectedUnit.downPct}%): {calcInstallment(selectedUnit.price, selectedUnit.downPct, selectedUnit.years).down.toLocaleString()} ج</div>
                <div>• القسط الربع سنوي: {calcInstallment(selectedUnit.price, selectedUnit.downPct, selectedUnit.years).quarterly.toLocaleString()} ج</div>
              </div>

              <button onClick={() => handleBookInspection(selectedUnit)} style={{ width: '100%', padding: '12px', background: '#16a34a', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                📅 طلب حجز أو معاينة رسمية (عبر الوسيط)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Client Profile Edit */}
      {view === 'client-profile' && (
        <div style={{ maxWidth: '450px', margin: '40px auto', background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#1e3a8a', marginTop: 0 }}>👤 تعديل الملف الشخصي</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginBottom: '15px' }}>
            <img src={clientProfile.avatar} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' }} />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'client')} style={{ fontSize: '11px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" value={clientProfile.name} onChange={e=>setClientProfile({...clientProfile, name: e.target.value})} style={{ padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
            <input type="text" value={clientProfile.phone} onChange={e=>setClientProfile({...clientProfile, phone: e.target.value})} style={{ padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
            <input type="text" value={clientProfile.address} onChange={e=>setClientProfile({...clientProfile, address: e.target.value})} style={{ padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
            <input type="text" value={clientProfile.job} onChange={e=>setClientProfile({...clientProfile, job: e.target.value})} style={{ padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
            <textarea value={clientProfile.bio} onChange={e=>setClientProfile({...clientProfile, bio: e.target.value})} style={{ padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' }}></textarea>
            
            <button onClick={() => { if(!validatePhone(clientProfile.phone)) return alert('رقم الهاتف غير صحيح!'); setView('client-dash'); alert('تم التحديث!'); }} style={{ padding: '12px', background: '#2563eb', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>حفظ التعديلات</button>
          </div>
        </div>
      )}

      {/* Dev Dashboard */}
      {view === 'dev-dash' && (
        <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={devProfile.logo} alt="Logo" style={{ width: '55px', height: '55px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #1e3a8a' }} />
              <div>
                <h3 style={{ margin: 0, color: '#1e3a8a' }}>{devProfile.company}</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{devProfile.devAddress} | {devProfile.devPhone}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button onClick={() => setView('dev-profile')} style={{ padding: '8px 14px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                🏢 بروفايل الشركة
              </button>

              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowDevNotifMenu(!showDevNotifMenu)} style={{ padding: '8px 14px', background: '#eff6ff', color: '#1e3a8a', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  🔔 إشعارات ({devNotifs.filter(n=>n.unread).length})
                </button>
                {showDevNotifMenu && (
                  <div style={{ position: 'absolute', left: 0, top: '45px', width: '300px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', zIndex: 10, boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#1e3a8a' }}>إشعارات المطور</h4>
                    {devNotifs.map((n, i) => (
                      <div key={i} style={{ background: n.unread ? '#f8fafc' : '#ffffff', padding: '8px', borderRadius: '5px', marginBottom: '5px', fontSize: '11px', borderBottom: '1px solid #f1f5f9' }}>
                        <div>{n.text}</div>
                        <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '3px' }}>{n.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
            <div style={{ background: '#ffffff', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#1e3a8a', marginTop: 0 }}>➕ إضافة وحدة أو مشروع عقاري</h4>
              <form onSubmit={handleAddUnit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="اسم المشروع" value={newUnit.project} onChange={e=>setNewUnit({...newUnit, project: e.target.value})} style={{ padding: '10px', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <select value={newUnit.type} onChange={e=>setNewUnit({...newUnit, type: e.target.value})} style={{ padding: '10px', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                  <option value="تجاري">تجاري</option><option value="سكني">سكني</option>
                </select>
                <select value={newUnit.city} onChange={e=>setNewUnit({...newUnit, city: e.target.value})} style={{ padding: '10px', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                  <option value="دمياط الجديدة">دمياط الجديدة</option><option value="المنصورة الجديدة">المنصورة الجديدة</option>
                </select>
                <input type="text" placeholder="المساحة" value={newUnit.space} onChange={e=>setNewUnit({...newUnit, space: e.target.value})} style={{ padding: '10px', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <input type="number" placeholder="السعر الإجمالي" value={newUnit.price} onChange={e=>setNewUnit({...newUnit, price: e.target.value})} style={{ padding: '10px', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <textarea placeholder="تفاصيل ومميزات الوحدة..." value={newUnit.details} onChange={e=>setNewUnit({...newUnit, details: e.target.value})} style={{ padding: '10px', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px' }}></textarea>
                <button type="submit" style={{ padding: '12px', background: '#1e3a8a', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>نشر الوحدة</button>
              </form>
            </div>

            <div style={{ background: '#ffffff', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#1e3a8a', marginTop: 0 }}>طلبات العملاء الحالية (سرية التوافق)</h4>
              {requests.map(r => (
                <div key={r.id} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>{r.code} - {r.city} ({r.type})</div>
                  <p style={{ fontSize: '13px', margin: '4px 0', color: '#334155' }}>المساحة: {r.space} | الميزانية: {r.budget}</p>
                  <button onClick={() => handleSendOffer(r.id, units[0])} style={{ width: '100%', padding: '8px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                    + تقديم عرض سعر للوسيط
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dev Profile Edit */}
      {view === 'dev-profile' && (
        <div style={{ maxWidth: '450px', margin: '40px auto', background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#1e3a8a', marginTop: 0 }}>🏢 تعديل بروفايل الشركة واللوجو</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginBottom: '15px' }}>
            <img src={devProfile.logo} alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #1e3a8a' }} />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'dev')} style={{ fontSize: '11px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" value={devProfile.company} onChange={e=>setDevProfile({...devProfile, company: e.target.value})} style={{ padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
            <input type="text" value={devProfile.devPhone} onChange={e=>setDevProfile({...devProfile, devPhone: e.target.value})} style={{ padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
            <input type="text" value={devProfile.devAddress} onChange={e=>setDevProfile({...devProfile, devAddress: e.target.value})} style={{ padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
            <textarea value={devProfile.bio} onChange={e=>setDevProfile({...devProfile, bio: e.target.value})} style={{ padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' }}></textarea>
            
            <button onClick={() => { if(!validatePhone(devProfile.devPhone)) return alert('رقم الهاتف غير صحيح!'); setView('dev-dash'); alert('تم التحديث!'); }} style={{ padding: '12px', background: '#1e3a8a', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>حفظ التعديلات</button>
          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      {view === 'admin' && (
        <div style={{ maxWidth: '1100px', margin: '30px auto', background: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#7c3aed', marginTop: 0 }}>🔐 لوحة تحكم الوسيط والداتا الحصرية (عصام)</h3>
          <p style={{ fontSize: '13px', color: '#64748b' }}>إدارة العملاء، الهواتف، وسحب داتا الإكسيل بضغطة زر:</p>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            <button onClick={() => exportToExcel(allClients, 'clients')} style={{ padding: '12px 20px', background: '#16a34a', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              📊 تحميل شيت إكسيل العملاء ({allClients.length})
            </button>
            <button onClick={() => exportToExcel(allDevelopers, 'developers')} style={{ padding: '12px 20px', background: '#2563eb', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              📊 تحميل شيت إكسيل المطورين ({allDevelopers.length})
            </button>
          </div>

          <h4 style={{ color: '#1e3a8a' }}>متابعة الطلبات والعروض المعلقة للعملاء:</h4>
          {requests.map(r => (
            <div key={r.id} style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <img src={r.avatar} alt="Client" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <b style={{ color: '#0f172a' }}>{r.code} - العميل: {r.clientName}</b>
                  <div style={{ color: '#16a34a', fontSize: '12px', fontWeight: 'bold' }}>📞 الهاتف السري: {r.phone}</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>الطلب: {r.type} في {r.city} | المساحة: {r.space} | الميزانية: {r.budget}</div>
              
              <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                <span style={{ fontSize: '12px', color: '#d97706', fontWeight: 'bold' }}>عروض المطورين المعلقة:</span>
                {r.offers.length === 0 ? (
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>لا توجد عروض مقدمة من المطورين بعد.</div>
                ) : (
                  r.offers.map((off, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', padding: '10px', borderRadius: '8px', marginTop: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#1e3a8a' }}>🏢 {off.dev}: {off.unitTitle} ({off.price.toLocaleString()} ج)</span>
                      <button onClick={() => handleForwardOfferToClient(r, off)} style={{ padding: '6px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                        إحالة العرض للعميل 🚀
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}