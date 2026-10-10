"use client";

import { motion } from 'framer-motion';
import { CONTACT } from '@/content/site';
import { track } from '@/lib/contact';
import { WhatsAppIcon } from '@/components/contact-fab';

/** Form gönderildikten sonra gösterilen ekran. */
export default function WhatsAppSent({ url, onEdit }: { url: string; onEdit: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
      <WhatsAppIcon size={44} className="mx-auto text-[#25D366] mb-4" />
      <h3 className="serif text-xl font-semibold mb-2">WhatsApp açılıyor</h3>
      <p className="text-sm text-[#F5EEE0]/60">
        Talebiniz hazır bir mesaj olarak WhatsApp’a aktarıldı. Rezervasyonun bize ulaşması için
        açılan sohbette <span className="text-[#F5EEE0]">Gönder</span>’e basmanız yeterli.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('whatsapp_click', { location: 'form_retry' })}
        className="mt-6 inline-flex items-center justify-center gap-2 bg-[#7A1020] px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#93162A] transition"
      >
        WhatsApp açılmadıysa tıklayın
      </a>
      <p className="mt-5 text-sm text-[#F5EEE0]/50">
        Dilerseniz arayın:{' '}
        <a
          href={`tel:${CONTACT.phoneTel}`}
          onClick={() => track('phone_click', { location: 'form_sent' })}
          className="text-[#C9A84C] hover:underline"
        >
          {CONTACT.phoneDisplay}
        </a>
      </p>
      <button type="button" onClick={onEdit} className="mt-4 text-xs uppercase tracking-wider text-[#F5EEE0]/40 hover:text-[#C9A84C] transition">
        Bilgileri düzenle
      </button>
    </motion.div>
  );
}
