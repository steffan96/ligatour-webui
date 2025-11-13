import React, { useState } from 'react';

export default function InfoMessage({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  if (!message || !visible) return null;

  return (
    <div className="notification-card">
      {message}
      <button className="close-button" onClick={() => setVisible(false)}>×</button>
    </div>
  );
}
