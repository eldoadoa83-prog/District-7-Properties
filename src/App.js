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

  // قائمة لجميع العملاء المسجلين في النظام (لتصديرها للإكسيل)
  const [allClients, setAllClients] = useState([
    { name: 'د. أحمد مبروك', phone: '01012345678', address: 'دمياط الجديدة', job: 'صيدلي', date: '2026-11-02' }
  ]);

  // قائمة لجميع المطورين المسجلين في النظام (لتصديرها للإكسيل)
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

  const [clientNotifs, setClientNotifs] = useState([{ text: 'أهلاً بك في منصة District 7.', time: 'الآن', unread: true }]);
  const [devNotifs, setDevNotifs] = useState([{ text: 'تم تفعيل حساب شركتك بنجاح.', time: 'الآن', unread: true }]);

  const [showClientNotifMenu, setShowClientNotifMenu] = useState(false);
  const [showDevNotifMenu, setShowDevNotifMenu] = useState(false);

  // دالة التحقق من صحة رقم الهاتف (يجب أن يكون أرقام فقط ولا يقل عن 10 أرقام)
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  // رفع الصورة من جهاز الكمبيوتر
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

  // تسجيل العميل مع التحقق الإجباري من صحة الهاتف
  const handleClientRegister = () => {
    if (!clientProfile.name) return alert('برجاء كتابة الاسم الكريم');
    if (!validatePhone(clientProfile.phone)) {
      return alert('❌ خطأ: رقم الهاتف غير صحيح أو غير متكامل! يجب أن يكون رقماً صحيحاً لا يقل عن 10 أرقام.');
    }
    
    // إضافة العميل لقائمة العملاء الكلية لو مش موجود
    const exists = allClients.some(c => c.phone === clientProfile.phone);
    if (!exists) {
      setAllClients([...allClients, { ...clientProfile, date: new Date().toLocaleDateString() }]);
    }
    setView('client-dash');
  };

  // تسجيل المطور مع التحقق الإجباري من الهاتف
  const handleDevRegister = () => {
    if (!devProfile.company) return alert('برجاء كتابة اسم الشركة');
    if (!validatePhone(devProfile.devPhone)) {
      return alert('❌ خطأ: رقم هاتف الشركة غير صحيح أو غير متكامل! يجب ألا يقل عن 10 أرقام.');
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

  // دالة تصدير بيانات العملاء إلى ملف Excel (CSV)
  const exportToExcel = (data, fileName) => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // لدعم اللغة العربية بشكل صحيح
    if (fileName === 'clients') {
      csvContent += "الاسم,الهاتف,العنوان,الوظيفة,تاريخ التسجيل\n";
      data.forEach(row => {
        csvContent += `${row.name},${row.phone},${row.address},${row.job},${row.date}\n`;
      });
    } else {
      csvContent += "اسم الشركة,الهاتف,العنوان,نبذة,تاريخ التسجيل\n";
      data.forEach(row => {
        csvContent += `${row.company},${row.phone},${row.address},${row.bio},${row.date}\n`;
      });
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
    <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', direction: 'rtl', padding: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#020617', padding: '15px 20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #1e293b' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px' }}>District 7 <span style={{ color: '#f59e0b' }}>Properties</span></h2>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>منصة الوساطة العقارية المحمية - دمياط والمنصورة الجديدة</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {view !== 'home' && <button onClick={() => setView('home')} style={{ padding: '8px 14px', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>الرئيسية</button>}
          <button onClick={() => setView('admin')} style={{ padding: '8px 14px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>🔐 لوحة الوسيط والداتا</button>
        </div>
      </div>

      {/* Home */}
      {view === 'home' && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>مرحباً بك في منصة <span style={{ color: '#f59e0b' }}>District 7</span></h1>
          <p style={{ color: '#94a3b8', marginBottom: '30px' }}>اختر نوع الحساب:</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => setView('client-login')} style={{ padding: '15px 30px', background: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>حساب عميل</button>
            <button onClick={() => setView('dev-login')} style={{ padding: '15px 30px', background: '#3b82f6', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>حساب مطور</button>
          </div>
        </div>
      )}

      {/* Client Login / Initial Setup with Phone Validation */}
      {view === 'client-login' && (
        <div style={{ maxWidth: '450px', margin: '20px auto', background: '#020617', padding: '25px', borderRadius: '15px', border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#f59e0b', marginTop: 0 }}>تسجيل الملف الشخصي للعميل</h3>
          <p style={{ fontSize: '11px', color: '#94a3b8' }}>يرجى إدخال رقم هاتف صحيح ومكتمل للمتابعة.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="الاسم الكريم" value={clientProfile.name} onChange={e=>setClientProfile({...clientProfile, name: e.target.value})} style={{ padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} />
            <input type="text" placeholder="رقم الهاتف (إجباري وصحيح 10 أرقام فأكثر)" value={clientProfile.phone} onChange={e=>setClientProfile({...clientProfile, phone: e.target.value})} style={{ padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} />
            <input type="text" placeholder="العنوان" value={clientProfile.address} onChange={e=>setClientProfile({...clientProfile, address: e.target.value})} style={{ padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} />
            <input type="text" placeholder="الوظيفة" value={clientProfile.job} onChange={e=>setClientProfile({...clientProfile, job: e.target.value})} style={{ padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} />
            
            <label style={{ fontSize: '12px', color: '#94a3b8' }}>رفع الصورة الشخصية:</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'client')} style={{ color: '#fff', fontSize: '12px' }} />

            <button onClick={handleClientRegister} style={{ padding: '10px', background: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>حفظ والدخول للحساب</button>
          </div>
        </div>
      )}

      {/* Dev Login / Initial Setup with Phone Validation */}
      {view === 'dev-login' && (
        <div style={{ maxWidth: '450px', margin: '20px auto', background: '#020617', padding: '25px', borderRadius: '15px', border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#3b82f6', marginTop: 0 }}>تسجيل بيانات شركة التطوير</h3>
          <p style={{ fontSize: '11px', color: '#94a3b8' }}>يرجى إدخال هاتف صحيح للتواصل.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="اسم الشركة" value={devProfile.company} onChange={e=>setDevProfile({...devProfile, company: e.target.value})} style={{ padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} />
            <input type="text" placeholder="رقم للتواصل (إجباري وصحيح)" value={devProfile.devPhone} onChange={e=>setDevProfile({...devProfile, devPhone: e.target.value})} style={{ padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} />
            <input type="text" placeholder="عنوان الشركة" value={devProfile.devAddress} onChange={e=>setDevProfile({...devProfile, devAddress: e.target.value})} style={{ padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} />
            
            <label style={{ fontSize: '12px', color: '#94a3b8' }}>رفع لوجو الشركة:</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'dev')} style={{ color: '#fff', fontSize: '12px' }} />

            <button onClick={handleDevRegister} style={{ padding: '10px', background: '#3b82f6', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>حفظ والدخول للبوابة</button>
          </div>
        </div>
      )}

      {/* Client Dashboard */}
      {view === 'client-dash' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#020617', padding: '15px 20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={clientProfile.avatar} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f59e0b' }} />
              <div>
                <h3 style={{ margin: 0, color: '#f59e0b' }}>{clientProfile.name}</h3>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{clientProfile.job} | {clientProfile.address}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button onClick={() => setView('client-profile')} style={{ padding: '8px 12px', background: '#334155', color: '#fff', border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                👤 البروفايل
              </button>

              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowClientNotifMenu(!showClientNotifMenu)} style={{ padding: '8px 12px', background: '#1e293b', color: '#f59e0b', border: '1px solid #f59e0b44', borderRadius: '6px', cursor: 'pointer' }}>
                  🔔 إشعاراتي ({clientNotifs.filter(n=>n.unread).length})
                </button>
                {showClientNotifMenu && (
                  <div style={{ position: 'absolute', left: 0, top: '40px', width: '300px', background: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', zIndex: 10 }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#f59e0b' }}>إشعارات العميل</h4>
                    {clientNotifs.map((n, i) => (
                      <div key={i} style={{ background: n.unread ? '#1e293b' : '#0f172a', padding: '8px', borderRadius: '5px', marginBottom: '5px', fontSize: '11px', opacity: n.unread ? 1 : 0.6 }}>
                        <div>{n.text}</div>
                        <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '3px' }}>{n.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: '#020617', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <h4 style={{ color: '#f59e0b', marginTop: 0 }}>➕ إضافة طلب عقاري جديد</h4>
              <form onSubmit={handleAddReq} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <select value={newReq.type} onChange={e=>setNewReq({...newReq, type: e.target.value})} style={{ padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }}>
                  <option value="تجاري">تجاري</option><option value="سكني">سكني</option><option value="طبي">طبي</option><option value="إداري">إداري</option>
                </select>
                <select value={newReq.city} onChange={e=>setNewReq({...newReq, city: e.target.value})} style={{ padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }}>
                  <option value="دمياط الجديدة">دمياط الجديدة</option><option value="المنصورة الجديدة">المنصورة الجديدة</option>
                </select>
                <input type="text" placeholder="المساحة المطلوبة" value={newReq.space} onChange={e=>setNewReq({...newReq, space: e.target.value})} style={{ padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
                <input type="text" placeholder="الميزانية" value={newReq.budget} onChange={e=>setNewReq({...newReq, budget: e.target.value})} style={{ padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
                <textarea placeholder="التفاصيل..." value={newReq.details} onChange={e=>setNewReq({...newReq, details: e.target.value})} style={{ padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }}></textarea>
                <button type="submit" style={{ padding: '10px', background: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>إرسال الطلب للوسيط</button>
              </form>
            </div>

            <div style={{ background: '#020617', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <h4 style={{ color: '#f59e0b', marginTop: 0 }}>العقارات المتاحة</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {units.map(u => (
                  <div key={u.id} onClick={() => setSelectedUnit(u)} style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155', cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img src={u.logo} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', color: '#3b82f6' }}>{u.dev}</div>
                      <h5 style={{ margin: '2px 0' }}>{u.project} ({u.city})</h5>
                      <span style={{ fontSize: '11px', color: '#f59e0b' }}>{u.price.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedUnit && (
            <div style={{ background: '#020617', padding: '20px', borderRadius: '12px', border: '1px solid #f59e0b', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ color: '#f59e0b', margin: 0 }}>تفاصيل عقار: {selectedUnit.project}</h3>
                <button onClick={() => setSelectedUnit(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '5px', cursor: 'pointer' }}>إغلاق</button>
              </div>
              <p><b>المطور:</b> {selectedUnit.dev} | <b>الموقع:</b> {selectedUnit.city} | <b>المساحة:</b> {selectedUnit.space}</p>
              <p><b>التفاصيل:</b> {selectedUnit.details || 'لا توجد تفاصيل إضافية.'}</p>
              <p><b>السعر الإجمالي:</b> <span style={{ color: '#22c55e' }}>{selectedUnit.price.toLocaleString()} ج.م</span></p>
              
              <div style={{ background: '#0f172a', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '15px' }}>
                <div>💳 حاسبة الأقساط (تسهيلات {selectedUnit.years} سنوات):</div>
                <div>• المقدم ({selectedUnit.downPct}%): {calcInstallment(selectedUnit.price, selectedUnit.downPct, selectedUnit.years).down.toLocaleString()} ج</div>
                <div>• قسط ربع سنوي: {calcInstallment(selectedUnit.price, selectedUnit.downPct, selectedUnit.years).quarterly.toLocaleString()} ج</div>
              </div>

              <button onClick={() => handleBookInspection(selectedUnit)} style={{ width: '100%', padding: '10px', background: '#22c55e', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                📅 طلب حجز أو معاينة (عبر الوسيط)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Client Profile Edit */}
      {view === 'client-profile' && (
        <div style={{ maxWidth: '450px', margin: '20px auto', background: '#020617', padding: '25px', borderRadius: '15px', border: '1px solid #f59e0b' }}>
          <h3 style={{ color: '#f59e0b', marginTop: 0 }}>👤 تعديل الملف الشخصي للعميل</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
            <img src={clientProfile.avatar} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f59e0b' }} />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'client')} style={{ color: '#fff', fontSize: '11px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" value={clientProfile.name} onChange={e=>setClientProfile({...clientProfile, name: e.target.value})} style={{ padding: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
            <input type="text" value={clientProfile.phone} onChange={e=>setClientProfile({...clientProfile, phone: e.target.value})} style={{ padding: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
            <input type="text" value={clientProfile.address} onChange={e=>setClientProfile({...clientProfile, address: e.target.value})} style={{ padding: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
            <input type="text" value={clientProfile.job} onChange={e=>setClientProfile({...clientProfile, job: e.target.value})} style={{ padding: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
            <textarea value={clientProfile.bio} onChange={e=>setClientProfile({...clientProfile, bio: e.target.value})} style={{ padding: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }}></textarea>
            
            <button onClick={() => { if(!validatePhone(clientProfile.phone)) return alert('رقم الهاتف غير صحيح!'); setView('client-dash'); alert('تم التحديث!'); }} style={{ padding: '10px', background: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>حفظ والعودة</button>
          </div>
        </div>
      )}

      {/* Dev Dashboard */}
      {view === 'dev-dash' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#020617', padding: '15px 20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={devProfile.logo} alt="Logo" style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover', border: '2px solid #3b82f6' }} />
              <div>
                <h3 style={{ margin: 0, color: '#3b82f6' }}>{devProfile.company}</h3>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{devProfile.devAddress} | {devProfile.devPhone}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button onClick={() => setView('dev-profile')} style={{ padding: '8px 12px', background: '#334155', color: '#fff', border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                🏢 بروفايل الشركة
              </button>

              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowDevNotifMenu(!showDevNotifMenu)} style={{ padding: '8px 12px', background: '#1e293b', color: '#3b82f6', border: '1px solid #3b82f644', borderRadius: '6px', cursor: 'pointer' }}>
                  🔔 إشعارات ({devNotifs.filter(n=>n.unread).length})
                </button>
                {showDevNotifMenu && (
                  <div style={{ position: 'absolute', left: 0, top: '40px', width: '300px', background: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', zIndex: 10 }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#3b82f6' }}>إشعارات المطور</h4>
                    {devNotifs.map((n, i) => (
                      <div key={i} style={{ background: n.unread ? '#1e293b' : '#0f172a', padding: '8px', borderRadius: '5px', marginBottom: '5px', fontSize: '11px', opacity: n.unread ? 1 : 0.6 }}>
                        <div>{n.text}</div>
                        <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '3px' }}>{n.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: '#020617', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <h4 style={{ color: '#3b82f6', marginTop: 0 }}>➕ إضافة وحدة عقارية</h4>
              <form onSubmit={handleAddUnit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="اسم المشروع" value={newUnit.project} onChange={e=>setNewUnit({...newUnit, project: e.target.value})} style={{ padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
                <select value={newUnit.type} onChange={e=>setNewUnit({...newUnit, type: e.target.value})} style={{ padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }}>
                  <option value="تجاري">تجاري</option><option value="سكني">سكني</option>
                </select>
                <select value={newUnit.city} onChange={e=>setNewUnit({...newUnit, city: e.target.value})} style={{ padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }}>
                  <option value="دمياط الجديدة">دمياط الجديدة</option><option value="المنصورة الجديدة">المنصورة الجديدة</option>
                </select>
                <input type="text" placeholder="المساحة" value={newUnit.space} onChange={e=>setNewUnit({...newUnit, space: e.target.value})} style={{ padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
                <input type="number" placeholder="السعر الإجمالي" value={newUnit.price} onChange={e=>setNewUnit({...newUnit, price: e.target.value})} style={{ padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
                <textarea placeholder="تفاصيل ومميزات الوحدة..." value={newUnit.details} onChange={e=>setNewUnit({...newUnit, details: e.target.value})} style={{ padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }}></textarea>
                <button type="submit" style={{ padding: '10px', background: '#3b82f6', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>نشر الوحدة</button>
              </form>
            </div>

            <div style={{ background: '#020617', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <h4 style={{ color: '#3b82f6', marginTop: 0 }}>طلبات العملاء الحالية</h4>
              {requests.map(r => (
                <div key={r.id} style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #334155' }}>
                  <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold' }}>{r.code} - {r.city} ({r.type})</div>
                  <p style={{ fontSize: '12px', margin: '4px 0' }}>المساحة: {r.space} | الميزانية: {r.budget}</p>
                  <button onClick={() => handleSendOffer(r.id, units[0])} style={{ width: '100%', padding: '6px', background: '#3b82f622', color: '#60a5fa', border: '1px solid #3b82f644', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>
                    + تقديم عرض للوسيط
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dev Profile Edit */}
      {view === 'dev-profile' && (
        <div style={{ maxWidth: '450px', margin: '20px auto', background: '#020617', padding: '25px', borderRadius: '15px', border: '1px solid #3b82f6' }}>
          <h3 style={{ color: '#3b82f6', marginTop: 0 }}>🏢 تعديل بروفايل الشركة</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
            <img src={devProfile.logo} alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '6px', objectFit: 'cover', border: '2px solid #3b82f6' }} />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'dev')} style={{ color: '#fff', fontSize: '11px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" value={devProfile.company} onChange={e=>setDevProfile({...devProfile, company: e.target.value})} style={{ padding: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
            <input type="text" value={devProfile.devPhone} onChange={e=>setDevProfile({...devProfile, devPhone: e.target.value})} style={{ padding: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
            <input type="text" value={devProfile.devAddress} onChange={e=>setDevProfile({...devProfile, devAddress: e.target.value})} style={{ padding: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }} />
            <textarea value={devProfile.bio} onChange={e=>setDevProfile({...devProfile, bio: e.target.value})} style={{ padding: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }}></textarea>
            
            <button onClick={() => { if(!validatePhone(devProfile.devPhone)) return alert('رقم الهاتف غير صحيح!'); setView('dev-dash'); alert('تم التحديث!'); }} style={{ padding: '10px', background: '#3b82f6', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>حفظ والعودة</button>
          </div>
        </div>
      )}

      {/* Admin Dashboard with Data Export Options */}
      {view === 'admin' && (
        <div style={{ background: '#020617', padding: '20px', borderRadius: '12px', border: '1px solid #8b5cf6' }}>
          <h3 style={{ color: '#8b5cf6', marginTop: 0 }}>🔐 لوحة تحكم الوسيط والداتا الحصرية (عصام)</h3>
          <p style={{ fontSize: '12px', color: '#cbd5e1' }}>يمكنك سحب وتحميل كافة بيانات العملاء والمطورين في ملفات إكسيل (CSV) بضغطة زر واحدة:</p>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <button onClick={() => exportToExcel(allClients, 'clients')} style={{ padding: '10px 15px', background: '#22c55e', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              📊 تحميل شيت إكسيل العملاء ({allClients.length})
            </button>
            <button onClick={() => exportToExcel(allDevelopers, 'developers')} style={{ padding: '10px 15px', background: '#3b82f6', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              📊 تحميل شيت إكسيل المطورين ({allDevelopers.length})
            </button>
          </div>

          <h4 style={{ color: '#f59e0b' }}>متابعة الطلبات والعروض المعلقة:</h4>
          {requests.map(r => (
            <div key={r.id} style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <img src={r.avatar} alt="Client" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <b>{r.code} - العميل: {r.clientName}</b>
                  <div style={{ color: '#22c55e', fontSize: '12px' }}>📞 الهاتف السري: {r.phone}</div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>الطلب: {r.type} في {r.city} | المساحة: {r.space} | الميزانية: {r.budget}</div>
              
              <div style={{ marginTop: '10px', borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
                <span style={{ fontSize: '11px', color: '#f59e0b' }}>عروض المطورين المعلقة:</span>
                {r.offers.length === 0 ? (
                  <div style={{ fontSize: '11px', color: '#64748b' }}>لا توجد عروض مقدمة بعد.</div>
                ) : (
                  r.offers.map((off, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e3a8a33', padding: '8px', borderRadius: '6px', marginTop: '5px' }}>
                      <span style={{ fontSize: '11px' }}>🏢 {off.dev}: {off.unitTitle} ({off.price.toLocaleString()} ج)</span>
                      <button onClick={() => handleForwardOfferToClient(r, off)} style={{ padding: '5px 10px', background: '#22c55e', color: '#000', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
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