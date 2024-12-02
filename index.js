import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Hiển thị tin nhắn của người dùng trên giao diện
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: input },
    ]);

    try {
      // Gửi tin nhắn đến backend
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      // Kiểm tra lỗi HTTP
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Hiển thị phản hồi từ backend
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: data.response || 'Không có phản hồi từ chatbot.' },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'Có lỗi xảy ra. Vui lòng thử lại.' },
      ]);
    }

    // Xóa nội dung trong ô nhập
    setInput('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Chatbot TDH</h1>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '10px',
          padding: '10px',
          height: '400px',
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              margin: '5px 0',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                backgroundColor: msg.sender === 'user' ? '#d1f4d1' : '#f4f4f4',
                padding: '10px',
                borderRadius: '10px',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px', display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          style={{
            flexGrow: 1,
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '10px',
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            marginLeft: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
