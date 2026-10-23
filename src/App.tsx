import { useMemo, useState } from 'react'
import {
  ArrowDownRight, ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown,
  Clock3, Compass, CreditCard, Heart, MapPin, Menu, Minus, Plus, Search,
  ShieldCheck, Ticket, TicketCheck, Users, X, Zap
} from 'lucide-react'

type EventItem = {
  id: number; title: string; category: string; date: string; time: string;
  location: string; venue: string; price: number; image: string; featured?: boolean;
  description: string; organizer: string; attendees: string
}

const initialEvents: EventItem[] = [
  {
    id: 1, title: 'After Hours: The Purple Edition', category: 'Nightlife',
    date: 'Sat, Nov 14, 2026', time: '8:00 PM', location: 'Lagos, Nigeria',
    venue: 'The Rooftop, Victoria Island', price: 12000,
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=85',
    featured: true, description: 'One night, great music, and a room full of people who came for the experience. Join local DJs and special guests for a late-night celebration in the heart of Lagos.',
    organizer: 'After Hours Collective', attendees: '320+ going'
  },
  {
    id: 2, title: 'Lagos Live Sessions', category: 'Concerts',
    date: 'Fri, Nov 20, 2026', time: '7:30 PM', location: 'Lagos, Nigeria',
    venue: 'Muri Okunola Park', price: 8500,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1000&q=80',
    description: 'An open-air live music experience with emerging artists, soulful sounds, and a crowd that knows every word.',
    organizer: 'Live Sessions NG', attendees: '180+ going'
  },
  {
    id: 3, title: 'The Creative Meetup', category: 'Community',
    date: 'Sun, Nov 22, 2026', time: '2:00 PM', location: 'Lagos, Nigeria',
    venue: 'Civic Centre, Victoria Island', price: 5000,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=80',
    description: 'A relaxed afternoon connecting designers, founders, creators, and curious minds. Share ideas and meet your next collaborator.',
    organizer: 'The Creative Circle', attendees: '95+ going'
  },
  {
    id: 4, title: 'Founders & Future', category: 'Business',
    date: 'Wed, Dec 02, 2026', time: '10:00 AM', location: 'Lagos, Nigeria',
    venue: 'Landmark Event Centre', price: 18000,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    description: 'A practical gathering for founders and builders to exchange lessons, make useful connections, and explore what comes next.',
    organizer: 'Founders Network', attendees: '240+ going'
  },
  {
    id: 5, title: 'Sunset on the Terrace', category: 'Nightlife',
    date: 'Sat, Dec 05, 2026', time: '5:00 PM', location: 'Lagos, Nigeria',
    venue: 'Sky Lounge, Lekki', price: 10000,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=80',
    description: 'Golden-hour views, good food, and a soundtrack built for the weekend. Come early for sunset and stay for the music.',
    organizer: 'Terrace Social', attendees: '150+ going'
  },
  {
    id: 6, title: 'Design That Works', category: 'Business',
    date: 'Tue, Dec 08, 2026', time: '9:00 AM', location: 'Lagos, Nigeria',
    venue: 'Zone Tech Park, Gbagada', price: 7500,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    description: 'A hands-on event about building thoughtful digital products, from research and strategy through to the details people notice.',
    organizer: 'Product People Lagos', attendees: '110+ going'
  }
]

const categories = ['All events', 'Concerts', 'Nightlife', 'Business', 'Community']
const money = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

export default function App() {
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('eventora-events')
      return saved ? [...initialEvents, ...JSON.parse(saved)] : initialEvents
    } catch { return initialEvents }
  })
  const [page, setPage] = useState<'home' | 'events' | 'organizer' | 'tickets'>('home')
  const [selected, setSelected] = useState<EventItem | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All events')
  const [checkoutEvent, setCheckoutEvent] = useState<EventItem | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [checkoutDone, setCheckoutDone] = useState(false)
  const [myTickets, setMyTickets] = useState<{id: string; event: EventItem; qty: number; name: string; email: string}[]>(() => {
    try { return JSON.parse(localStorage.getItem('eventora-tickets') || '[]') } catch { return [] }
  })
  const [favorites, setFavorites] = useState<number[]>([])
  const [mobileMenu, setMobileMenu] = useState(false)
  const [toast, setToast] = useState('')
  const [newEvent, setNewEvent] = useState({ title: '', category: 'Concerts', date: '', time: '7:00 PM', location: 'Lagos, Nigeria', venue: '', price: '5000', image: '' })
  const [customer, setCustomer] = useState({ name: '', email: '' })

  const filteredEvents = useMemo(() => events.filter(event => {
    const matchesCategory = category === 'All events' || event.category === category
    const text = `${event.title} ${event.location} ${event.category} ${event.venue}`.toLowerCase()
    return matchesCategory && text.includes(query.toLowerCase())
  }), [events, category, query])

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  function go(next: typeof page) {
    setPage(next); setSelected(null); setCheckoutEvent(null); setCheckoutDone(false); setMobileMenu(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function saveEvents(next: EventItem[]) {
    setEvents(next)
    const custom = next.filter(event => event.id > 100)
    localStorage.setItem('eventora-events', JSON.stringify(custom))
  }

  function toggleFavorite(id: number) {
    setFavorites(old => old.includes(id) ? old.filter(item => item !== id) : [...old, id])
  }

  function completePurchase(e: React.FormEvent) {
    e.preventDefault()
    if (!checkoutEvent || !customer.name.trim() || !customer.email.includes('@')) {
      notify('Enter a name and a valid email address.')
      return
    }
    const ticket = { id: `EV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, event: checkoutEvent, qty: quantity, name: customer.name, email: customer.email }
    const next = [ticket, ...myTickets]
    setMyTickets(next)
    localStorage.setItem('eventora-tickets', JSON.stringify(next))
    setCheckoutDone(true)
  }

  function createEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!newEvent.title.trim() || !newEvent.date || !newEvent.venue.trim()) {
      notify('Add an event name, date, and venue first.')
      return
    }
    const created: EventItem = {
      id: Date.now() % 100000000 + 100, title: newEvent.title, category: newEvent.category,
      date: new Date(`${newEvent.date}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }),
      time: newEvent.time, location: newEvent.location, venue: newEvent.venue,
      price: Math.max(0, Number(newEvent.price) || 0),
      image: newEvent.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
      description: 'An event created in the Eventora demo. Add your event details and share it with your audience.',
      organizer: 'Your organization', attendees: 'New event'
    }
    saveEvents([created, ...events])
    setNewEvent({ title: '', category: 'Concerts', date: '', time: '7:00 PM', location: 'Lagos, Nigeria', venue: '', price: '5000', image: '' })
    notify('Event published to this demo.')
    go('events')
  }

  const featured = events.find(event => event.featured) || events[0]

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => go('home')} aria-label="Eventora home">
          <span className="brand-mark"><Ticket size={20} strokeWidth={2.5} /></span>
          <span>eventora<span className="brand-dot">.</span></span>
        </button>
        <nav className={`nav-links ${mobileMenu ? 'nav-open' : ''}`}>
          <button className={page === 'home' ? 'nav-active' : ''} onClick={() => go('home')}>Home</button>
          <button className={page === 'events' ? 'nav-active' : ''} onClick={() => go('events')}>Explore events</button>
          <button className={page === 'tickets' ? 'nav-active' : ''} onClick={() => go('tickets')}>My tickets</button>
        </nav>
        <div className="top-actions">
          <button className="organizer-link" onClick={() => go('organizer')}>For organizers <ArrowRight size={15} /></button>
          <button className="mobile-menu" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main>
        {page === 'home' && !selected && !checkoutEvent && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <div className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT EXPERIENCE STARTS HERE</div>
                <h1>Good plans.<br /><span>Great stories.</span></h1>
                <p className="hero-text">Find the events worth leaving home for. Discover live music, nights out, and people doing interesting things near you.</p>
                <div className="hero-buttons">
                  <button className="button-primary" onClick={() => go('events')}>Explore events <ArrowRight size={17} /></button>
                  <button className="button-quiet" onClick={() => go('organizer')}>Host an event</button>
                </div>
                <div className="hero-proof"><div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>+</span></div><div><strong>Find your people.</strong><small>Experiences are better together.</small></div></div>
              </div>
              <button className="hero-feature" onClick={() => setSelected(featured)} aria-label={`View ${featured?.title}`}>
                <img src={featured?.image} alt="" />
                <div className="feature-shade" />
                <div className="feature-top"><span className="live-pill"><span /> FEATURED EVENT</span><span className="feature-arrow"><ArrowUpRightIcon /></span></div>
                <div className="feature-bottom">
                  <span className="feature-category">{featured?.category}</span>
                  <h2>{featured?.title}</h2>
                  <div className="feature-meta"><span><CalendarDays size={15} /> {featured?.date}</span><span><MapPin size={15} /> {featured?.location}</span></div>
                  <div className="feature-footer"><span>From <strong>{money(featured?.price || 0)}</strong></span><span className="text-link">View event <ArrowRight size={15} /></span></div>
                </div>
              </button>
            </section>
            <section className="quick-search">
              <div className="search-heading"><Search size={18} /><span>Find your next event</span></div>
              <div className="search-input-wrap"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && go('events')} placeholder="Search events, venues, or locations" /><button onClick={() => go('events')}>Search events</button></div>
            </section>
            <section className="section-block">
              <div className="section-heading"><div><span className="section-kicker">CURATED FOR YOU</span><h2>Events worth your time</h2><p>A few good reasons to get out there.</p></div><button className="text-link" onClick={() => go('events')}>View all events <ArrowRight size={16} /></button></div>
              <div className="category-row">{categories.map(item => <button key={item} onClick={() => { setCategory(item); go('events') }} className={category === item ? 'category-chip selected' : 'category-chip'}>{item}</button>)}</div>
              <div className="event-grid">{events.slice(0, 3).map(event => <EventCard key={event.id} event={event} onOpen={() => setSelected(event)} favorite={favorites.includes(event.id)} onFavorite={() => toggleFavorite(event.id)} />)}</div>
            </section>
            <section className="organizer-banner">
              <div className="banner-icon"><Zap size={23} /></div><div><span className="section-kicker">PUT YOUR EVENT OUT THERE</span><h2>Planning something good?</h2><p>Bring your audience together. Create an event and manage ticket sales in one place.</p></div><button className="button-primary" onClick={() => go('organizer')}>Create an event <ArrowRight size={16} /></button>
            </section>
          </>
        )}

        {page === 'events' && !selected && !checkoutEvent && (
          <section className="page-content">
            <div className="page-title-row"><div><span className="section-kicker">THE GOOD STUFF</span><h1>Explore events</h1><p>Find something to look forward to.</p></div><span className="result-count">{filteredEvents.length} events</span></div>
            <div className="browse-tools"><div className="search-input-wrap browse-search"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by event, venue, or location" /></div><div className="category-row">{categories.map(item => <button key={item} onClick={() => setCategory(item)} className={category === item ? 'category-chip selected' : 'category-chip'}>{item}</button>)}</div></div>
            {filteredEvents.length ? <div className="event-grid">{filteredEvents.map(event => <EventCard key={event.id} event={event} onOpen={() => setSelected(event)} favorite={favorites.includes(event.id)} onFavorite={() => toggleFavorite(event.id)} />)}</div> : <div className="empty-state"><Compass size={32} /><h3>No events found</h3><p>Try another search or category.</p><button className="button-secondary" onClick={() => { setQuery(''); setCategory('All events') }}>Clear filters</button></div>}
          </section>
        )}

        {selected && !checkoutEvent && (
          <section className="page-content detail-page">
            <button className="back-link" onClick={() => { setSelected(null); if (page === 'home') go('events') }}><ArrowLeft size={16} /> Back to events</button>
            <div className="detail-layout">
              <div className="detail-main"><img className="detail-image" src={selected.image} alt={selected.title} /><div className="detail-tags"><span className="category-label">{selected.category}</span><span className="muted-label"><Users size={14} /> {selected.attendees}</span></div><h1>{selected.title}</h1><p className="detail-description">{selected.description}</p><div className="detail-info-grid"><div><CalendarDays /><span><small>Date</small><strong>{selected.date}</strong></span></div><div><Clock3 /><span><small>Time</small><strong>{selected.time}</strong></span></div><div><MapPin /><span><small>Venue</small><strong>{selected.venue}</strong><small>{selected.location}</small></span></div></div><div className="organizer-info"><div className="organizer-avatar">{selected.organizer.charAt(0)}</div><div><small>Organized by</small><strong>{selected.organizer}</strong></div><span className="verified"><ShieldCheck size={15} /> Organizer</span></div></div>
              <aside className="ticket-panel"><span className="section-kicker">GET YOUR TICKET</span><h3>Be there.</h3><p>Make a plan. We'll save your spot.</p><div className="price-line"><span>General admission</span><strong>{money(selected.price)}</strong></div><div className="price-line muted"><span>Service fee</span><span>Included in demo</span></div><div className="panel-divider" /><div className="price-total"><span>From</span><strong>{money(selected.price)}</strong></div><button className="button-primary full-width" onClick={() => { setCheckoutEvent(selected); setQuantity(1); setCheckoutDone(false) }}>Get tickets <ArrowRight size={16} /></button><div className="secure-note"><ShieldCheck size={15} /> Secure checkout experience</div><div className="demo-note">Demo only · No real payment is collected.</div></aside>
            </div>
          </section>
        )}

        {checkoutEvent && (
          <section className="page-content checkout-page">
            <button className="back-link" onClick={() => { setCheckoutEvent(null); setCheckoutDone(false) }}><ArrowLeft size={16} /> Back to event</button>
            {!checkoutDone ? <div className="checkout-layout"><div className="checkout-form-card"><span className="section-kicker">ALMOST THERE</span><h1>Get your tickets</h1><p className="subtle">Add your details to reserve your place.</p><form onSubmit={completePurchase}><label>Full name<input required value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} placeholder="e.g. Daniel Ben" /></label><label>Email address<input required type="email" value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} placeholder="you@example.com" /></label><div className="quantity-row"><div><strong>General admission</strong><small>{money(checkoutEvent.price)} per ticket</small></div><div className="quantity-control"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={15} /></button><span>{quantity}</span><button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))}><Plus size={15} /></button></div></div><div className="checkout-total"><span>Total</span><strong>{money(checkoutEvent.price * quantity)}</strong></div><button className="button-primary full-width" type="submit"><CreditCard size={17} /> Confirm demo booking</button><p className="demo-disclaimer"><ShieldCheck size={15} /> This is a prototype. No payment will be processed.</p></form></div><aside className="checkout-summary"><img src={checkoutEvent.image} alt="" /><span className="section-kicker">YOUR EVENT</span><h3>{checkoutEvent.title}</h3><p><CalendarDays size={15} /> {checkoutEvent.date}</p><p><MapPin size={15} /> {checkoutEvent.venue}</p><div className="panel-divider" /><div className="price-line"><span>{quantity} × General admission</span><strong>{money(checkoutEvent.price * quantity)}</strong></div><div className="price-line muted"><span>Fees</span><span>₦0</span></div></aside></div> : <div className="success-card"><div className="success-icon"><Check size={34} /></div><span className="section-kicker">BOOKING CONFIRMED</span><h1>You're on the list.</h1><p>Your demo ticket for <strong>{checkoutEvent.title}</strong> has been created. No payment was taken.</p><div className="success-ticket"><div><small>EVENT</small><strong>{checkoutEvent.title}</strong></div><div><small>ATTENDEE</small><strong>{customer.name}</strong></div><div><small>QUANTITY</small><strong>{quantity} ticket{quantity > 1 ? 's' : ''}</strong></div><div><small>BOOKING REFERENCE</small><strong>EV-{myTickets[0]?.id?.replace('EV-', '') || 'DEMO01'}</strong></div></div><button className="button-primary" onClick={() => go('tickets')}>View my tickets <ArrowRight size={16} /></button></div>}
          </section>
        )}

        {page === 'tickets' && !selected && !checkoutEvent && (
          <section className="page-content">
            <div className="page-title-row"><div><span className="section-kicker">YOUR PLANS</span><h1>My tickets</h1><p>All your event bookings in one place.</p></div><TicketCheck className="page-title-icon" size={31} /></div>
            {myTickets.length ? <div className="my-ticket-list">{myTickets.map(ticket => <article className="my-ticket" key={ticket.id}><img src={ticket.event.image} alt="" /><div className="my-ticket-info"><span className="category-label">{ticket.event.category}</span><h3>{ticket.event.title}</h3><p><CalendarDays size={15} /> {ticket.event.date}</p><p><MapPin size={15} /> {ticket.event.venue}</p><small>Booking ref: {ticket.id} · {ticket.qty} ticket(s)</small></div><div className="fake-qr" aria-label="Demo QR code"><QrPattern /></div></article>)}</div> : <div className="empty-state"><Ticket size={34} /><h3>No tickets yet</h3><p>When you book an event, your tickets will show up here.</p><button className="button-primary" onClick={() => go('events')}>Explore events <ArrowRight size={16} /></button></div>}
          </section>
        )}

        {page === 'organizer' && !selected && !checkoutEvent && (
          <section className="page-content organizer-page">
            <div className="page-title-row"><div><span className="section-kicker">ORGANIZER STUDIO</span><h1>Your events, in one place.</h1><p>Create an event and see how the organizer experience works.</p></div><div className="organizer-icon"><Zap size={22} /></div></div>
            <div className="stats-grid"><Stat label="Published events" value={events.filter(e => e.id > 100).length.toString()} hint="In this demo" icon={<CalendarDays />} /><Stat label="Tickets sold" value={myTickets.reduce((sum, t) => sum + t.qty, 0).toString()} hint="Demo bookings" icon={<TicketCheck />} /><Stat label="Demo revenue" value={money(myTickets.reduce((sum, t) => sum + t.qty * t.event.price, 0))} hint="Not real payments" icon={<ArrowDownRight />} /></div>
            <div className="organizer-columns"><div className="form-card"><span className="section-kicker">NEW LISTING</span><h2>Create an event</h2><p className="subtle">Fill in the basics to publish a sample event.</p><form onSubmit={createEvent} className="create-form"><label>Event name<input value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="e.g. Friday Night Live" required /></label><div className="form-two"><label>Category<select value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}>{categories.slice(1).map(c => <option key={c}>{c}</option>)}</select></label><label>Ticket price (₦)<input type="number" min="0" value={newEvent.price} onChange={e => setNewEvent({ ...newEvent, price: e.target.value })} required /></label></div><div className="form-two"><label>Date<input type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} required /></label><label>Start time<select value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}>{['10:00 AM','12:00 PM','2:00 PM','5:00 PM','7:00 PM','8:00 PM','9:00 PM'].map(t => <option key={t}>{t}</option>)}</select></label></div><label>Venue<input value={newEvent.venue} onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })} placeholder="Venue name, area" required /></label><label>Location<input value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} /></label><label>Event image URL <span className="optional">(optional)</span><input value={newEvent.image} onChange={e => setNewEvent({ ...newEvent, image: e.target.value })} placeholder="https://..." /></label><button className="button-primary full-width" type="submit">Publish event <ArrowRight size={16} /></button></form></div><div className="manage-card"><div className="manage-heading"><div><span className="section-kicker">YOUR LISTINGS</span><h2>Recent events</h2></div><span className="count-pill">{events.filter(e => e.id > 100).length}</span></div>{events.filter(e => e.id > 100).length ? events.filter(e => e.id > 100).map(event => <div className="managed-event" key={event.id}><img src={event.image} alt="" /><div><strong>{event.title}</strong><small>{event.date} · {event.venue}</small><span>{money(event.price)} / ticket</span></div><span className="published-dot">Published</span></div>) : <div className="manage-empty"><CalendarDays size={25} /><strong>No events published yet</strong><span>Your events will appear here after you publish them.</span></div>}<div className="manage-footnote"><ShieldCheck size={15} /> Organizer tools are shown for prototype demonstration.</div></div></div>
          </section>
        )}
      </main>

      <footer className="footer"><div className="footer-brand"><span className="brand-mark"><Ticket size={18} /></span><strong>eventora<span className="brand-dot">.</span></strong></div><span>Good plans. Great stories.</span><div className="footer-right"><span>Prototype demo</span><span>© 2026 Eventora</span></div></footer>
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  )
}

function EventCard({ event, onOpen, favorite, onFavorite }: { event: EventItem; onOpen: () => void; favorite: boolean; onFavorite: () => void }) {
  return <article className="event-card"><button className="event-image-button" onClick={onOpen} aria-label={`View ${event.title}`}><img className="event-image" src={event.image} alt="" /><span className="card-category">{event.category}</span></button><button className={`favorite-button ${favorite ? 'favorited' : ''}`} onClick={onFavorite} aria-label={favorite ? 'Remove from saved' : 'Save event'}><Heart size={17} fill={favorite ? 'currentColor' : 'none'} /></button><button className="event-card-content" onClick={onOpen}><span className="event-date"><CalendarDays size={14} /> {event.date}</span><h3>{event.title}</h3><p><MapPin size={14} /> {event.venue}</p><div className="event-card-bottom"><span>From <strong>{money(event.price)}</strong></span><span className="card-arrow"><ArrowUpRightIcon /></span></div></button></article>
}

function Stat({ label, value, hint, icon }: { label: string; value: string; hint: string; icon: React.ReactNode }) {
  return <div className="stat-card"><span className="stat-icon">{icon}</span><span className="stat-label">{label}</span><strong>{value}</strong><small>{hint}</small></div>
}
function ArrowUpRightIcon() { return <ArrowRight size={17} style={{ transform: 'rotate(-45deg)' }} /> }
function QrPattern() {
  return <div className="qr-grid">{Array.from({ length: 49 }, (_, i) => <span key={i} className={[0,1,2,7,9,14,15,16,21,28,29,30,34,35,36,37,38,40,42,43,44,45,46,48].includes(i) ? 'qr-dark' : ''} />)}</div>
}
