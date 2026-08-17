import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowUpRight, Bell, BriefcaseBusiness, Check, ChevronDown,
  CircleDollarSign, Edit3, GraduationCap, LayoutDashboard, Plus, Search,
  Trash2, Users, X, ClipboardList, UserRound, Building2, CalendarDays,
} from 'lucide-react';
import './styles.css';

type Status = 'Placed' | 'Interview' | 'Training';
type Page = 'Dashboard' | 'Students' | 'StudentDetails' | 'Fees' | 'PlacementDesk' | 'Courses' | 'DataVault' | 'BackupCenter' | 'Companies';
type Student = {
  id: string; name: string; email: string; phone: string; course: string; year: string;
  status: Status; company: string; score: number; feePaid: number; feeTotal: number;
  joined: string;
};
type Audit = { id: string; time: string; action: string; student: string; detail: string };

const seedStudents: Student[] = [
  {id:'STU-001',name:'Aarav Menon',email:'aarav@uniq.edu',phone:'+91 98765 12001',course:'BCA — Full Stack',year:'2026',status:'Placed',company:'Zoho',score:92,feePaid:25000,feeTotal:25000,joined:'12 Jan 2026'},
  {id:'STU-002',name:'Ananya Raj',email:'ananya@uniq.edu',phone:'+91 98765 12002',course:'B.Sc Computer Science',year:'2026',status:'Placed',company:'Freshworks',score:88,feePaid:18000,feeTotal:25000,joined:'18 Jan 2026'},
  {id:'STU-003',name:'Vikram Kumar',email:'vikram@uniq.edu',phone:'+91 98765 12003',course:'BCA — Data Science',year:'2026',status:'Interview',company:'TCS',score:81,feePaid:15000,feeTotal:25000,joined:'24 Jan 2026'},
  {id:'STU-004',name:'Meera Krishnan',email:'meera@uniq.edu',phone:'+91 98765 12004',course:'B.Com — Finance',year:'2026',status:'Training',company:'—',score:76,feePaid:10000,feeTotal:20000,joined:'02 Feb 2026'},
  {id:'STU-005',name:'Rohan Das',email:'rohan@uniq.edu',phone:'+91 98765 12005',course:'BCA — Full Stack',year:'2026',status:'Placed',company:'Infosys',score:90,feePaid:25000,feeTotal:25000,joined:'08 Feb 2026'},
  {id:'STU-006',name:'Priya Nair',email:'priya@uniq.edu',phone:'+91 98765 12006',course:'B.Sc IT',year:'2026',status:'Interview',company:'Accenture',score:84,feePaid:20000,feeTotal:25000,joined:'14 Feb 2026'},
  {id:'STU-007',name:'Karthik Rajan',email:'karthik@uniq.edu',phone:'+91 98765 12007',course:'BCA — Full Stack',year:'2026',status:'Training',company:'—',score:79,feePaid:25000,feeTotal:25000,joined:'22 Feb 2026'},
  {id:'STU-008',name:'Nila Joseph',email:'nila@uniq.edu',phone:'+91 98765 12008',course:'B.Sc Computer Science',year:'2026',status:'Placed',company:'Zoho',score:94,feePaid:12000,feeTotal:25000,joined:'01 Mar 2026'},
];
const seedAudit: Audit[] = [
  {id:'A-1',time:'Today, 11:42 AM',action:'Student added',student:'Aarav Menon',detail:'New student record created'},
  {id:'A-2',time:'Today, 10:18 AM',action:'Status updated',student:'Vikram Kumar',detail:'Training → Interview'},
  {id:'A-3',time:'Yesterday, 4:30 PM',action:'Fee updated',student:'Ananya Raj',detail:'₹18,000 paid'},
];

function load<T>(key:string, fallback:T):T { try { const raw=localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
function App(){
  const [page,setPage]=useState<Page>('Dashboard');
  const [students,setStudents]=useState<Student[]>(()=>load('uniq_students',seedStudents));
  const [audit,setAudit]=useState<Audit[]>(()=>load('uniq_audit',seedAudit));
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [query,setQuery]=useState('');
  const [statusFilter,setStatusFilter]=useState<'All'|Status>('All');
  const [modal,setModal]=useState<'add'|'edit'|null>(null);
  const [notice,setNotice]=useState('');

  useEffect(()=>localStorage.setItem('uniq_students',JSON.stringify(students)),[students]);
  useEffect(()=>localStorage.setItem('uniq_audit',JSON.stringify(audit)),[audit]);
  const notify=(text:string)=>{setNotice(text); window.setTimeout(()=>setNotice(''),2400)};
  const log=(action:string,student:string,detail:string)=>setAudit(a=>[{id:crypto.randomUUID(),time:new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}),action,student,detail},...a]);
  const openStudent=(id:string)=>{setSelectedId(id);setPage('StudentDetails')};
  const saveStudent=(data:Student,isEdit:boolean)=>{
    if(isEdit){ const old=students.find(s=>s.id===data.id); setStudents(ss=>ss.map(s=>s.id===data.id?data:s)); log('Student updated',data.name,`Profile edited${old?.status!==data.status?` • ${old?.status} → ${data.status}`:''}`); notify('Student updated successfully'); }
    else {setStudents(ss=>[data,...ss]); log('Student added',data.name,'New student record created'); notify('Student added successfully');}
    setModal(null);
  };
  const deleteStudent=(id:string)=>{const s=students.find(x=>x.id===id); if(!s)return; if(!confirm(`Delete ${s.name}?`))return; setStudents(ss=>ss.filter(x=>x.id!==id)); log('Student deleted',s.name,'Student record removed'); setPage('Students'); setSelectedId(null); notify('Student deleted');};
  const stats={total:students.length,placed:students.filter(s=>s.status==='Placed').length,companies:new Set(students.filter(s=>s.company!=='—').map(s=>s.company)).size,open:Math.max(0,76-students.filter(s=>s.status==='Placed').length),paid:students.filter(s=>s.feePaid>=s.feeTotal).length,pending:students.filter(s=>s.feePaid>0&&s.feePaid<s.feeTotal).length,unpaid:students.filter(s=>s.feePaid===0).length};
  return <div className="app">
    <header className="site-header">
      <div className="brand" onClick={()=>setPage('Dashboard')}><span className="brand-mark">U</span><span>UNIQ</span></div>
      <nav className="top-nav">
        <Nav label="Dashboard" icon={<LayoutDashboard size={17}/>} active={page==='Dashboard'} onClick={()=>setPage('Dashboard')}/>
        <Nav label="Students" icon={<Users size={17}/>} active={page==='Students'||page==='StudentDetails'} onClick={()=>setPage('Students')}/>
        <Nav label="Fees" icon={<CircleDollarSign size={17}/>} active={page==='Fees'} onClick={()=>setPage('Fees')}/>
        <Nav label="Placement Desk" icon={<BriefcaseBusiness size={17}/>} active={page==='PlacementDesk'} onClick={()=>setPage('PlacementDesk')}/>
        <Nav label="Courses" icon={<GraduationCap size={17}/>} active={page==='Courses'} onClick={()=>setPage('Courses')}/>
        <Nav label="Data Vault" icon={<ClipboardList size={17}/>} active={page==='DataVault'} onClick={()=>setPage('DataVault')}/>
        <Nav label="Backup Center" icon={<Building2 size={17}/>} active={page==='BackupCenter'} onClick={()=>setPage('BackupCenter')}/>
      </nav>
      <div className="header-right"><button className="round-btn" onClick={()=>notify('No new notifications')}><Bell size={18}/></button><div className="admin"><span>AK</span><div><b>Admin</b><small>Placement team</small></div></div></div>
    </header>
    <main>
      {page==='Dashboard' && <Dashboard stats={stats} students={students} onNavigate={setPage} onStudent={openStudent} />}
      {page==='Students' && <Students students={students} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onAdd={()=>setModal('add')} onEdit={(s)=>{setSelectedId(s.id);setModal('edit')}} onDelete={deleteStudent} onStudent={openStudent} audit={audit} />}
      {page==='StudentDetails' && <StudentDetails student={students.find(s=>s.id===selectedId)} onBack={()=>setPage('Students')} onEdit={()=>setModal('edit')} onDelete={()=>selectedId&&deleteStudent(selectedId)} />}
      {page==='Companies' && <Companies students={students} onBack={()=>setPage('Dashboard')} />}
      {page==='Fees' && <Fees students={students} onStudent={openStudent}/>} 
      {page==='PlacementDesk' && <PlacementDesk students={students} audit={audit}/>} 
      {page==='Courses' && <Courses students={students} onEnroll={(course)=>notify(`${course} enrollment started`)}/>} 
      {page==='DataVault' && <DataVault students={students} audit={audit}/>} 
      {page==='BackupCenter' && <BackupCenter students={students} audit={audit} notify={notify}/>} 
    </main>
    {modal && <StudentModal mode={modal} initial={modal==='edit'?students.find(s=>s.id===selectedId):undefined} onClose={()=>setModal(null)} onSave={saveStudent}/>} 
    {notice && <div className="toast"><Check size={17}/>{notice}</div>}
  </div>
}
function Nav({label,icon,active,onClick}:{label:string;icon:React.ReactNode;active:boolean;onClick:()=>void}){return <button className={`top-nav-item ${active?'active':''}`} onClick={onClick}>{icon}<span>{label}</span></button>}
function Dashboard({stats,students,onNavigate,onStudent}:{stats:any;students:Student[];onNavigate:(p:Page)=>void;onStudent:(id:string)=>void}){
 const rate=stats.total?Math.round(stats.placed/stats.total*100):0; const statusCounts=['Placed','Interview','Training'].map(status=>({status,n:students.filter(s=>s.status===status).length}));
 return <div className="page-shell">
  <section className="dashboard-hero"><div><p className="kicker">UNIQ / STUDENT PLACEMENT</p><h1>Give every student<br/><em>a better next step.</em></h1><p className="hero-copy">A simple command centre for student readiness, placement progress, fees and hiring outcomes.</p><button className="black-btn" onClick={()=>onNavigate('Students')}>Manage students <ArrowUpRight size={18}/></button></div><div className="hero-orbit"><div className="hero-circle"><GraduationCap size={32}/><b>{rate}%</b><small>placement rate</small></div><div className="hero-sticker">UNIQ<br/><strong>2026</strong></div></div></section>
  <div className="section-title"><div><p className="kicker">PLACEMENT AT A GLANCE</p><h2>Know the numbers.</h2></div><span>{new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span></div>
  <div className="metric-grid">
   <Metric label="Total students" value={stats.total} hint="Student directory" icon={<Users/>} onClick={()=>onNavigate('Students')}/>
   <Metric label="Students placed" value={stats.placed} hint={`${rate}% placement rate`} icon={<GraduationCap/>} lime onClick={()=>onNavigate('Students')}/>
   <Metric label="Companies" value={stats.companies} hint="Hiring partners" icon={<Building2/>} onClick={()=>onNavigate('Companies')}/>
   <Metric label="Open positions" value={stats.open} hint="Available opportunities" icon={<BriefcaseBusiness/>} onClick={()=>onNavigate('Companies')}/>
   <Metric label="Fees completed" value={stats.paid} hint={`${stats.pending} pending • ${stats.unpaid} unpaid`} icon={<CircleDollarSign/>} onClick={()=>onNavigate('Fees')}/>
  </div>
  <div className="analytics-grid"><section className="card analytics-card"><div className="card-head"><div><p className="kicker">ANALYTICS</p><h3>Student placement mix</h3></div><span className="year-pill">2026</span></div><div className="bars">{statusCounts.map(x=><div className="bar-row" key={x.status}><div><b>{x.status}</b><span>{x.n} students</span></div><div className="bar-track"><i style={{width:`${stats.total?Math.max(8,x.n/stats.total*100):0}%`}}/></div></div>)}</div><div className="donut-wrap"><div className="donut" style={{background:`conic-gradient(#191919 0 ${rate}%, #dfff75 ${rate}% 100%)`}}><div><b>{stats.placed}</b><small>placed</small></div></div><div><p className="muted">PLACEMENT RATE</p><strong>{rate}%</strong><p className="muted">of active students have a placement.</p></div></div></section>
  <section className="card activity-card"><div className="card-head"><div><p className="kicker">RECENT</p><h3>Students</h3></div><button className="link-btn" onClick={()=>onNavigate('Students')}>View all →</button></div>{students.slice(0,5).map(s=><button className="mini-student" key={s.id} onClick={()=>onStudent(s.id)}><div className="avatar">{initials(s.name)}</div><div><b>{s.name}</b><small>{s.course}</small></div><StatusBadge value={s.status}/><ArrowUpRight size={15}/></button>)}</section></div>
  <section className="journey card"><div><p className="kicker">WORKFLOW</p><h3>Placement journey</h3></div><div className="journey-steps"><Step n="01" label="Training" value={students.filter(s=>s.status==='Training').length}/><Step n="02" label="Interview" value={students.filter(s=>s.status==='Interview').length}/><Step n="03" label="Placed" value={stats.placed}/></div></section>
 </div>
}
function Metric({label,value,hint,icon,lime,onClick}:{label:string;value:number;hint:string;icon:React.ReactNode;lime?:boolean;onClick:()=>void}){return <button className={`metric ${lime?'lime':''}`} onClick={onClick}><div className="metric-icon">{icon}</div><div className="metric-label">{label}</div><strong>{value}</strong><small>{hint}</small><ArrowUpRight className="metric-arrow" size={18}/></button>}
function Step({n,label,value}:{n:string;label:string;value:number}){return <div className="step"><span>{n}</span><div><b>{label}</b><strong>{value}</strong></div></div>}
function Students({students,query,setQuery,statusFilter,setStatusFilter,onAdd,onEdit,onDelete,onStudent,audit}:{students:Student[];query:string;setQuery:(x:string)=>void;statusFilter:'All'|Status;setStatusFilter:(x:'All'|Status)=>void;onAdd:()=>void;onEdit:(s:Student)=>void;onDelete:(id:string)=>void;onStudent:(id:string)=>void;audit:Audit[]}){
 const filtered=useMemo(()=>students.filter(s=>(statusFilter==='All'||s.status===statusFilter)&&`${s.name} ${s.course} ${s.company}`.toLowerCase().includes(query.toLowerCase())),[students,query,statusFilter]);
 return <div className="page-shell"><PageHead kicker="STUDENT DIRECTORY" title="Students" desc="Add, edit, track and review every student from one clean workspace." action="Add student" onAction={onAdd}/><div className="toolbar"><div className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, course or company..."/></div><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)}><option>All</option><option>Placed</option><option>Interview</option><option>Training</option></select></div><div className="students-layout"><section className="card table-card"><div className="table-scroll"><table><thead><tr><th>STUDENT</th><th>COURSE</th><th>STATUS</th><th>COMPANY</th><th>FEE</th><th>ACTION</th></tr></thead><tbody>{filtered.map(s=><tr key={s.id}><td><button className="student-link" onClick={()=>onStudent(s.id)}><span className="avatar">{initials(s.name)}</span><span><b>{s.name}</b><small>{s.id}</small></span></button></td><td>{s.course}</td><td><StatusBadge value={s.status}/></td><td>{s.company}</td><td><span className={`fee-dot ${s.feePaid>=s.feeTotal?'paid':s.feePaid?'pending':'unpaid'}`}/>{s.feePaid>=s.feeTotal?'Paid':s.feePaid?'Pending':'Unpaid'}</td><td><div className="actions"><button onClick={()=>onEdit(s)} title="Edit"><Edit3 size={15}/></button><button className="danger" onClick={()=>onDelete(s.id)} title="Delete"><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div>{filtered.length===0&&<div className="empty">No students found.</div>}</section><AuditPanel audit={audit}/></div></div>
}
function AuditPanel({audit}:{audit:Audit[]}){return <aside className="card audit"><div className="card-head"><div><p className="kicker">AUDIT TRAIL</p><h3>Every change, recorded.</h3></div><ClipboardList size={19}/></div><div className="audit-list">{audit.slice(0,12).map(a=><div className="audit-item" key={a.id}><span className="audit-dot"/><div><b>{a.action}</b><strong>{a.student}</strong><small>{a.detail}</small><time>{a.time}</time></div></div>)}</div></aside>}
function StudentDetails({student,onBack,onEdit,onDelete}:{student?:Student;onBack:()=>void;onEdit:()=>void;onDelete:()=>void}){if(!student)return <div className="page-shell"><button className="back-btn" onClick={onBack}><ArrowLeft size={16}/> Back</button><div className="empty">Student not found.</div></div>; return <div className="page-shell"><button className="back-btn" onClick={onBack}><ArrowLeft size={16}/> Students</button><div className="detail-head"><div><p className="kicker">STUDENT PROFILE / {student.id}</p><h1>{student.name}</h1><p>{student.course} • Batch {student.year}</p></div><div className="detail-actions"><button className="outline-btn" onClick={onEdit}><Edit3 size={16}/> Edit</button><button className="delete-btn" onClick={onDelete}><Trash2 size={16}/> Delete</button></div></div><div className="detail-grid"><section className="card profile-card"><div className="big-avatar">{initials(student.name)}</div><div className="profile-info"><StatusBadge value={student.status}/><h3>{student.name}</h3><p>{student.email}</p><p>{student.phone}</p></div></section><InfoCard icon={<GraduationCap/>} label="Course" value={student.course}/><InfoCard icon={<BriefcaseBusiness/>} label="Company" value={student.company}/><InfoCard icon={<CalendarDays/>} label="Joined" value={student.joined}/><InfoCard icon={<ClipboardList/>} label="Readiness score" value={`${student.score}%`}/><InfoCard icon={<CircleDollarSign/>} label="Fees" value={`₹${student.feePaid.toLocaleString()} / ₹${student.feeTotal.toLocaleString()}`}/></div><section className="card profile-section"><div className="card-head"><div><p className="kicker">PLACEMENT</p><h3>Current progress</h3></div></div><div className="profile-progress"><div className={`progress-step ${student.status==='Training'||student.status==='Interview'||student.status==='Placed'?'done':''}`}><span>1</span><b>Training</b></div><div className={`progress-step ${student.status==='Interview'||student.status==='Placed'?'done':''}`}><span>2</span><b>Interview</b></div><div className={`progress-step ${student.status==='Placed'?'done':''}`}><span>3</span><b>Placed</b></div></div></section></div>}
function InfoCard({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="card info-card"><span>{icon}</span><small>{label}</small><b>{value}</b></div>}
function Companies({
  students,
  onBack,
}: {
  students: Student[];
  onBack: () => void;
}) {
  const grouped = Object.entries(
    students.reduce<Record<string, number>>((acc, student) => {
      if (student.company !== '—') {
        acc[student.company] = (acc[student.company] || 0) + 1;
      }
      return acc;
    }, {})
  );

  return (
    <div className="page-shell">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={16} />
        Dashboard
      </button>

      <PageHead
        kicker="HIRING NETWORK"
        title="Companies"
        desc="A detailed view opened from the dashboard metric — no permanent company tab needed."
      />

      <div className="company-list">
        {grouped.map(([name, count]) => (
          <div className="card company-row" key={name}>
            <div className="company-logo">{name[0]}</div>

            <div>
              <h3>{name}</h3>
              <p>
                {count} student{count > 1 ? 's' : ''} placed / interviewing
              </p>
            </div>

            <strong>{count}</strong>

            <ArrowUpRight size={19} />
          </div>
        ))}

        {grouped.length === 0 && (
          <div className="empty">No company data yet.</div>
        )}
      </div>
    </div>
  );
}
function Fees({students,onStudent}:{students:Student[];onStudent:(id:string)=>void}){const paid=students.filter(s=>s.feePaid>=s.feeTotal),pending=students.filter(s=>s.feePaid>0&&s.feePaid<s.feeTotal),unpaid=students.filter(s=>s.feePaid===0);return <div className="page-shell"><PageHead kicker="FEE TRACKER" title="Student fees" desc="See who completed fees, who is pending and who has not paid yet."/><div className="fee-summary"><FeeMetric title="Completed" n={paid.length} cls="done"/><FeeMetric title="Pending" n={pending.length} cls="wait"/><FeeMetric title="Not paid" n={unpaid.length} cls="none"/></div><section className="card fee-table"><table><thead><tr><th>STUDENT</th><th>PAID</th><th>TOTAL</th><th>STATUS</th></tr></thead><tbody>{students.map(s=><tr key={s.id}><td><button className="student-link" onClick={()=>onStudent(s.id)}><span className="avatar">{initials(s.name)}</span><span><b>{s.name}</b><small>{s.course}</small></span></button></td><td>₹{s.feePaid.toLocaleString()}</td><td>₹{s.feeTotal.toLocaleString()}</td><td><span className={`fee-status ${s.feePaid>=s.feeTotal?'paid':s.feePaid?'pending':'unpaid'}`}>{s.feePaid>=s.feeTotal?'Completed':s.feePaid?'Pending':'Not paid'}</span></td></tr>)}</tbody></table></section></div>}
function FeeMetric({title,n,cls}:{title:string;n:number;cls:string}){return <div className={`fee-metric card ${cls}`}><small>{title}</small><strong>{n}</strong><span>students</span></div>}

function PlacementDesk({students,audit}:{students:Student[];audit:Audit[]}){
 const revenue=students.reduce((n,s)=>n+s.feePaid,0); const pending=students.reduce((n,s)=>n+Math.max(0,s.feeTotal-s.feePaid),0); const placed=students.filter(s=>s.status==='Placed').length;
 return <div className="page-shell"><PageHead kicker="OPERATIONS / PLACEMENT DESK" title="Placement Desk" desc="Track placement revenue, pending collections and every operational change in one command centre."/>
  <div className="desk-metrics"><div className="desk-money card lime"><small>REVENUE COLLECTED</small><strong>₹{revenue.toLocaleString('en-IN')}</strong><span>Across {students.length} students</span></div><div className="desk-money card"><small>PENDING AMOUNT</small><strong>₹{pending.toLocaleString('en-IN')}</strong><span>Outstanding student fees</span></div><div className="desk-money card"><small>PLACED STUDENTS</small><strong>{placed}</strong><span>{students.length?Math.round(placed/students.length*100):0}% placement rate</span></div></div>
  <div className="desk-grid"><section className="card placement-summary"><div className="card-head"><div><p className="kicker">REVENUE OVERVIEW</p><h3>Collection health</h3></div><CircleDollarSign/></div><div className="collection-bar"><i style={{width:`${students.reduce((n,s)=>n+s.feeTotal,0)?Math.round(revenue/students.reduce((n,s)=>n+s.feeTotal,0)*100):0}%`}}/></div><div className="collection-meta"><span>Collected <b>₹{revenue.toLocaleString('en-IN')}</b></span><span>Total billing <b>₹{students.reduce((n,s)=>n+s.feeTotal,0).toLocaleString('en-IN')}</b></span></div><div className="desk-note">Placement Desk is the operational view for finance + hiring progress. Student records remain the source of truth.</div></section><AuditPanel audit={audit}/></div>
 </div>
}
function Courses({students,onEnroll}:{students:Student[];onEnroll:(course:string)=>void}){
 const courses: Array<[string, string, string, number]> = [
  ['Python Full Stack', 'Build modern web applications with Python.', 'PY', 12],
  ['Java Full Stack', 'Build enterprise applications with Java.', 'JV', 8],
  ['Data Analytics', 'Learn data analysis, visualization and insights.', 'DA', 10],
  ['AI', 'Explore artificial intelligence and machine learning.', 'AI', 15],
  ];
 return <div className="page-shell"><PageHead kicker="LEARNING / COURSES" title="Courses" desc="Four career-focused tracks. Students can choose a course and begin their enrollment journey."/><div className="course-grid">{courses.map(([name,desc,mark,count])=><section className="card course-card" key={name}><div className="course-mark">{mark}</div><p className="kicker">UNIQ ACADEMY</p><h3>{name}</h3><p>{desc}</p><div className="course-bottom"><span><b>{count}</b> enrolled</span><button className="black-btn" onClick={()=>onEnroll(name)}>Enroll now <ArrowUpRight size={16}/></button></div></section>)}</div><section className="card enrollment-note"><GraduationCap size={22}/><div><b>Enrollment flow</b><p>Choose a course → submit enrollment → student is added to the selected learning track → placement readiness can be tracked from Students.</p></div></section></div>
}
function DataVault({students,audit}:{students:Student[];audit:Audit[]}){return <div className="page-shell"><PageHead kicker="SECURE DATA / DATA VAULT" title="Data Vault" desc="A clean overview of the records maintained by UNIQ. This area is read-only and designed for safe review."/><div className="vault-grid"><VaultCard title="Student records" value={students.length} detail="Profiles, courses, status and fee data"/><VaultCard title="Audit records" value={audit.length} detail="System and student change history"/><VaultCard title="Fee records" value={students.length} detail="Paid, pending and outstanding amounts"/><VaultCard title="Placement records" value={students.filter(s=>s.status==='Placed').length} detail="Students with placement outcomes"/></div><section className="card vault-table"><div className="card-head"><div><p className="kicker">DATA INVENTORY</p><h3>Protected collections</h3></div><span className="secure-pill">LOCAL STORAGE</span></div>{['Students','Audit Trail','Fees','Placement Outcomes'].map(x=><div className="vault-row" key={x}><span className="vault-lock">✓</span><div><b>{x}</b><small>Available in the current UNIQ workspace</small></div><strong>Protected</strong></div>)}</section></div>}
function VaultCard({title,value,detail}:{title:string;value:number;detail:string}){return <div className="card vault-card"><span className="vault-icon"><ClipboardList size={17}/></span><small>{title}</small><strong>{value}</strong><p>{detail}</p></div>}
function BackupCenter({students,audit,notify}:{students:Student[];audit:Audit[];notify:(x:string)=>void}){const backup=()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),students,audit},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`uniq-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);notify('Backup exported successfully')}; return <div className="page-shell"><PageHead kicker="SYSTEM / BACKUP CENTER" title="Backup Center" desc="Export a portable copy of your student and audit records whenever you need a safe restore point."/><section className="backup-hero card"><div className="backup-icon"><Building2/></div><div><p className="kicker">READY TO EXPORT</p><h2>{students.length} students + {audit.length} audit events</h2><p>Your backup contains student records and system change history in a JSON file. No external service is required.</p><button className="black-btn" onClick={backup}>Create backup <ArrowUpRight size={17}/></button></div></section><div className="backup-grid"><VaultCard title="Student records" value={students.length} detail="Included in export"/><VaultCard title="Audit events" value={audit.length} detail="Included in export"/></div></div>}
function StudentModal({mode,initial,onClose,onSave}:{mode:'add'|'edit';initial?:Student;onClose:()=>void;onSave:(s:Student,isEdit:boolean)=>void}){const [form,setForm]=useState<Student>(initial||{id:`STU-${String(Date.now()).slice(-4)}`,name:'',email:'',phone:'',course:'',year:'2026',status:'Training',company:'—',score:70,feePaid:0,feeTotal:25000,joined:new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}); const set=(k:keyof Student,v:any)=>setForm(f=>({...f,[k]:v})); const submit=(e:React.FormEvent)=>{e.preventDefault(); if(!form.name||!form.email||!form.course)return; onSave(form,mode==='edit')};return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><form className="modal" onSubmit={submit}><div className="modal-head"><div><p className="kicker">{mode==='edit'?'EDIT STUDENT':'NEW STUDENT'}</p><h2>{mode==='edit'?'Update student':'Add student'}</h2></div><button type="button" onClick={onClose}><X/></button></div><div className="form-grid"><Field label="Full name"><input value={form.name} onChange={e=>set('name',e.target.value)} required placeholder="Student name"/></Field><Field label="Email"><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} required placeholder="student@email.com"/></Field><Field label="Phone"><input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+91..."/></Field><Field label="Course"><input value={form.course} onChange={e=>set('course',e.target.value)} required placeholder="BCA — Full Stack"/></Field><Field label="Batch"><input value={form.year} onChange={e=>set('year',e.target.value)}/></Field><Field label="Status"><select value={form.status} onChange={e=>set('status',e.target.value as Status)}><option>Placed</option><option>Interview</option><option>Training</option></select></Field><Field label="Company"><input value={form.company} onChange={e=>set('company',e.target.value)} placeholder="Company or —"/></Field><Field label="Readiness score"><input type="number" min="0" max="100" value={form.score} onChange={e=>set('score',Number(e.target.value))}/></Field><Field label="Fee paid"><input type="number" min="0" value={form.feePaid} onChange={e=>set('feePaid',Number(e.target.value))}/></Field><Field label="Fee total"><input type="number" min="0" value={form.feeTotal} onChange={e=>set('feeTotal',Number(e.target.value))}/></Field></div><div className="modal-actions"><button type="button" className="outline-btn" onClick={onClose}>Cancel</button><button className="black-btn" type="submit">{mode==='edit'?'Save changes':'Add student'}</button></div></form></div>}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="field"><span>{label}</span>{children}</label>}
function PageHead({kicker,title,desc,action,onAction}:{kicker:string;title:string;desc:string;action?:string;onAction?:()=>void}){return <div className="page-head"><div><p className="kicker">{kicker}</p><h1>{title}</h1><p>{desc}</p></div>{action&&<button className="black-btn" onClick={onAction}><Plus size={18}/>{action}</button>}</div>}
function StatusBadge({value}:{value:Status}){return <span className={`status-badge ${value.toLowerCase()}`}><i/>{value}</span>}
function initials(name:string){return name.split(' ').map(x=>x[0]).slice(0,2).join('')}
export default App;
