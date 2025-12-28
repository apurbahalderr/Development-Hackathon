'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button';
import { Bell } from 'lucide-react';

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

interface NotificationManagerProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
}

export default function NotificationManager({ className, variant = "ghost" }: NotificationManagerProps) {
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

  if (isSubscribed) return null;

  return (
    <Button 
      onClick={subscribeUser}
      variant={variant}
      size="sm"
      className={`text-text-secondary hover:text-white ${className}`}
      leftIcon={<Bell size={18} />}
    >
      Enable Notifications
    </Button>
  )
}
