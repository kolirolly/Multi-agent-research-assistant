import { useEffect, useRef } from 'react';
import { useResearchStore } from '../store/researchStore';

export const useWebSocket = (jobId: string | null) => {
  const { setStatus, setReport, addProgressUpdate } = useResearchStore();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/${jobId}`);
    wsRef.current = ws;

        ws.onopen = () => {
          console.log('Connected to websocket');
          
          // Setup heartbeat to prevent connection drop
          const pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send('ping');
            }
          }, 25000); // 25 seconds
          
          ws.onclose = () => {
            clearInterval(pingInterval);
            console.log('Disconnected from websocket');
          };
        };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket Message:", data);
        if (data.event === 'research_completed') {
          setStatus('completed');
          setReport(data.report);
        } else if (data.event === 'research_failed') {
          setStatus('failed');
          addProgressUpdate({ agent: 'System', message: `Error: ${data.error}` });
        } else {
          addProgressUpdate(data);
        }
      } catch (e) {
        console.error('Failed to parse websocket message', e);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from websocket');
    };

    return () => {
      ws.close();
    };
  }, [jobId, setStatus, setReport, addProgressUpdate]);

  return wsRef.current;
};
