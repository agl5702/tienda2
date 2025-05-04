import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const WhatsAppButton = ({ 
  phoneNumber, 
  invoiceId, 
  defaultMessage = "Hola, tengo una consulta sobre mi factura" 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    
    // Abrir chat de WhatsApp después de un pequeño retraso
    setTimeout(() => {
      const encodedMessage = encodeURIComponent(`${defaultMessage} https://jhscristoenmi.vercel.app/ver_factura/${invoiceId}`);
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    }, 300);
  };

  return (
    
    <button 
    className='btn ms-2 px-2 btn-sm text-white' style={{background:"#25D366"}}
      onClick={handleClick}
      onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
    >
      <FaWhatsapp size={20} />
    </button>
  );
};

export default WhatsAppButton;