import React, { useContext, useMemo } from 'react';
import Card from '../../components/Card';
import { UserDataContext } from '../../context/UserDataContext';

function getDayHour(dateStr) {
  const d = new Date(dateStr);
  return [d.getDay(), d.getHours()];
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Rituals() {
  const { recentTracks } = useContext(UserDataContext);

  const heatmap = useMemo(() => {
    const map = Array(7).fill(0).map(() => Array(24).fill(0));
    recentTracks.forEach(item => {
      const [day, hour] = getDayHour(item.played_at);
      map[day][hour]++;
    });
    return map;
  }, [recentTracks]);

  const max = Math.max(...heatmap.flat());

  return (
    <div style={{ padding: '2em', maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontWeight: 700, fontSize: '2em', marginBottom: '1em' }}>
        Listening Rituals
      </h2>
      <Card>
        <div style={{ marginBottom: '1.5em', color: 'var(--muted)' }}>
          Your weekly listening heatmap. Brighter = more plays.
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                {Array.from({ length: 24 }).map((_, h) => (
                  <th key={h} style={{ fontSize: 10, color: 'var(--muted)', padding: 2 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmap.map((row, d) => (
                <tr key={d}>
                  <td style={{ fontWeight: 600, color: 'var(--muted)', fontSize: 12, paddingRight: 4 }}>{days[d]}</td>
                  {row.map((val, h) => (
                    <td
                      key={h}
                      style={{
                        width: 16,
                        height: 16,
                        background: val
                          ? `rgba(29,185,84,${0.2 + 0.7 * (val / max)})`
                          : 'var(--border)',
                        borderRadius: 4,
                        border: '1px solid var(--border)',
                        transition: 'background 0.2s',
                      }}
                      title={`${val} plays`}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '1.5em', color: 'var(--muted)', fontSize: '0.95em' }}>
          Spot your “Monday Motivation” or “Late Night Chill” rituals!
        </div>
      </Card>
    </div>
  );
}
