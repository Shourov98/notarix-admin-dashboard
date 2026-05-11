"use client";

import { Mail, LayoutGrid, Check } from "lucide-react";
import { useState } from "react";

function Toggle({ checked, onChange }) {
  return (
    <button 
      onClick={onChange}
      className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${checked ? 'bg-[#1a4fdb]' : 'bg-zinc-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 flex items-center justify-center shadow-sm ${checked ? 'left-7' : 'left-1'}`}>
        {checked && <Check className="w-2.5 h-2.5 text-[#1a4fdb]" />}
      </div>
    </button>
  );
}

export default function NotaryNotificationsPage() {
  const [emailSettings, setEmailSettings] = useState({
    newOrder: true,
    statusUpdates: true,
    paymentReceived: true
  });

  const [inAppSettings, setInAppSettings] = useState({
    messages: true,
    documents: true,
    meetings: true
  });

  return (
    <div className="flex flex-col h-full bg-white p-8 space-y-8 max-w-4xl">
      
      {/* Email Notifications Card */}
      <div className="border border-zinc-200 rounded-[24px] overflow-hidden bg-white shadow-sm">
        <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
          <Mail className="w-5 h-5 text-[#1a4fdb]" />
          <h2 className="text-lg font-bold text-zinc-900">Email Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl hover:border-blue-100 transition-colors">
            <div>
              <h3 className="font-bold text-zinc-900 mb-1">New Order Assigned</h3>
              <p className="text-xs font-medium text-zinc-500">Receive an email when a new notarization order is available.</p>
            </div>
            <Toggle 
              checked={emailSettings.newOrder} 
              onChange={() => setEmailSettings(s => ({...s, newOrder: !s.newOrder}))} 
            />
          </div>
          <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl hover:border-blue-100 transition-colors">
            <div>
              <h3 className="font-bold text-zinc-900 mb-1">Order Status Updates</h3>
              <p className="text-xs font-medium text-zinc-500">Get notified when client signs or documents are updated.</p>
            </div>
            <Toggle 
              checked={emailSettings.statusUpdates} 
              onChange={() => setEmailSettings(s => ({...s, statusUpdates: !s.statusUpdates}))} 
            />
          </div>
          <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl hover:border-blue-100 transition-colors">
            <div>
              <h3 className="font-bold text-zinc-900 mb-1">Payment Received</h3>
              <p className="text-xs font-medium text-zinc-500">Instant email confirmation for every successful transaction.</p>
            </div>
            <Toggle 
              checked={emailSettings.paymentReceived} 
              onChange={() => setEmailSettings(s => ({...s, paymentReceived: !s.paymentReceived}))} 
            />
          </div>
        </div>
      </div>

      {/* In-App Notifications Card */}
      <div className="border border-zinc-200 rounded-[24px] overflow-hidden bg-white shadow-sm">
        <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
          <LayoutGrid className="w-5 h-5 text-[#1a4fdb]" />
          <h2 className="text-lg font-bold text-zinc-900">In-App Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl hover:border-blue-100 transition-colors">
            <div>
              <h3 className="font-bold text-zinc-900 mb-1">New Messages</h3>
              <p className="text-xs font-medium text-zinc-500">Real-time alerts for client messages in the secure portal.</p>
            </div>
            <Toggle 
              checked={inAppSettings.messages} 
              onChange={() => setInAppSettings(s => ({...s, messages: !s.messages}))} 
            />
          </div>
          <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl hover:border-blue-100 transition-colors">
            <div>
              <h3 className="font-bold text-zinc-900 mb-1">Document Upload Updates</h3>
              <p className="text-xs font-medium text-zinc-500">Badges on files when a user uploads supporting identification.</p>
            </div>
            <Toggle 
              checked={inAppSettings.documents} 
              onChange={() => setInAppSettings(s => ({...s, documents: !s.documents}))} 
            />
          </div>
          <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl hover:border-blue-100 transition-colors">
            <div>
              <h3 className="font-bold text-zinc-900 mb-1">Meeting Requests</h3>
              <p className="text-xs font-medium text-zinc-500">Pop-up notification for incoming video call invitations.</p>
            </div>
            <Toggle 
              checked={inAppSettings.meetings} 
              onChange={() => setInAppSettings(s => ({...s, meetings: !s.meetings}))} 
            />
          </div>
        </div>
      </div>

    </div>
  );
}
