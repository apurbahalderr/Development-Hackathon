'use client'
import { useEffect, useState } from 'react'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function NotificationManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(function(reg) {
          console.log('Service Worker Registered', reg);
          setRegistration(reg);
          reg.pushManager.getSubscription().then(function(sub) {
            if (sub) {
              setIsSubscribed(true);
              setSubscription(sub);
            }
          });
        })
        .catch(function(error) {
          console.error('Service Worker Registration Failed', error);
        });
    }
  }, []);

  const subscribeUser = async () => {
    if (!registration) return;
    
    const applicationServerKey = urlBase64ToUint8Array('BA8JjGcf9qRxBDRt-bhYXLICDRj28tL3izZC-7ZN8vNXh2tkAJfou6a0qwWUHpGbDMOJhSr_NsAjGyybhIITRJo'); 

    try {
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });
      console.log('User is subscribed:', sub);
      setSubscription(sub);
      setIsSubscribed(true);
      
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        body: JSON.stringify(sub),
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (err) {
      console.log('Failed to subscribe the user: ', err);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isSubscribed && (
        <button 
          onClick={subscribeUser}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          Enable Notifications
        </button>
      )}
    </div>
  )
}
