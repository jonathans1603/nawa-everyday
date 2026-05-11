import { useState } from 'react';
import Dashboard        from './pages/Dashboard';
import AboutUs          from './pages/AboutUs';
import Reservation      from './pages/Reservation';
import Feedback         from './pages/feedback';
import Menu             from './pages/menu';
import Payment          from './pages/payment';
import CashConfirmation from './pages/CashConfirmation';
import QRISPage from './pages/QRISpage';

export default function App() {
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [qrToken, setQrToken] = useState('');
  // ── Tambah state untuk menyimpan orderId setelah POST ──
  const [orderId, setOrderId] = useState(null);
  const [tableNumber, setTableNumber] = useState(0);

  const handleNavigate = (target) => {
    if (target === 'contact') {
      if (page === 'home') {
        scrollToContact();
      } else {
        setPage('home');
        setTimeout(scrollToContact, 100);
      }
    } else {
      setPage(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const totalPrice = cart.reduce((s, c) => s + (c.price + (c.addonTotal || 0)) * c.qty, 0);

  const renderPage = () => {
    switch (page) {
      case 'about':       return <AboutUs          onNavigate={handleNavigate} />;
      case 'reservation': return <Reservation      onNavigate={handleNavigate} />;
      case 'feedback':    return <Feedback         onNavigate={handleNavigate} />;
      case 'menu':        return <Menu             onNavigate={handleNavigate} cart={cart} setCart={setCart} onTableResolved={(num, token) => {
        setTableNumber(num);
        setQrToken(token);
      }}/>;
      case 'payment':
        return (
          <Payment
            cart={cart}
            totalPrice={totalPrice}
            tableNumber={tableNumber}    
            qrToken={qrToken}         // ← sesuaikan dari QR/URL param
            onNavigate={handleNavigate}
            onBack={() => setPage('menu')}        // ← tombol logo = kembali ke menu
            onOrderSuccess={(id) => setOrderId(id)} // ← simpan orderId dari DB
          />
        );
      case 'qris':
        return (
          <QRISPage
            cart={cart}
            totalPrice={totalPrice}
            tableNumber={tableNumber}          // ← sesuaikan dari URL param kalau ada
            qrToken={qrToken}
            orderId={orderId}
            onNavigate={handleNavigate}
    />
  );
      case 'cash':
        return (
          <CashConfirmation
            cart={cart}
            totalPrice={totalPrice}
            orderId={orderId}                    // ← diteruskan dari state
            tableNumber={tableNumber}
            qrToken={qrToken} 
            onNavigate={handleNavigate}
          />
        );
      default:            return <Dashboard        onNavigate={handleNavigate} />;
    }
  };
  return renderPage();
}
