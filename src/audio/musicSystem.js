// =============================================================================
// musicSystem — kelola track musik latar berdasarkan mood.
//
// Mood:
//   'santai'    : musik calm saat kota stabil
//   'cyberpunk' : lo-fi cyberpunk (default)
//   'malam'     : musik malam kota
//   'tegang'    : tension saat event besar / kriminalitas tinggi
//   'otomatis'  : pilih otomatis dari world snapshot (default)
//
// Track mapping: file di public/audio/music/. Owner cukup ganti file
// dengan nama yang sama, kode tidak perlu diubah.
// =============================================================================

import { playOnChannel, setChannelVolume } from './audioManager.js';

const MUSIC_CHANNEL = 'music';

export const MUSIC_MOODS = {
  santai:    { label: 'Santai',     src: '/audio/music/calm.mp3' },
  cyberpunk: { label: 'Cyberpunk',  src: '/audio/music/lofi-cyberpunk.mp3' },
  malam:     { label: 'Malam Kota', src: '/audio/music/night-city.mp3' },
  tegang:    { label: 'Tegang',     src: '/audio/music/tension.mp3' },
};

export const MUSIC_MOOD_KEYS = ['santai', 'cyberpunk', 'malam', 'tegang', 'otomatis'];
export const MUSIC_MOOD_LABEL = {
  santai:    'Santai',
  cyberpunk: 'Cyberpunk',
  malam:     'Malam Kota',
  tegang:    'Tegang',
  otomatis:  'Otomatis',
};

let _activeMood = null;

// Pilih mood otomatis dari snapshot dunia.
//   - tegang  : kriminalitas > 60 atau ekonomi krisis
//   - malam   : 19:00 - 04:59
//   - santai  : ekonomi stabil + cuaca cerah
//   - default : cyberpunk
export function pickAutoMood(snapshot) {
  if (!snapshot) return 'cyberpunk';
  if ((snapshot.kriminalitas ?? 0) > 60) return 'tegang';
  if (snapshot.ekonomi === 'Krisis')      return 'tegang';
  const jam = snapshot.jam ?? 12;
  if (jam >= 19 || jam < 5)               return 'malam';
  if (snapshot.ekonomi === 'Stabil' && snapshot.cuaca === 'Cerah') return 'santai';
  return 'cyberpunk';
}

// Set mood. Kalau berbeda dari yang aktif, crossfade ke track baru.
//   userMood  : pilihan owner ('santai' | ... | 'otomatis')
//   snapshot  : world state saat ini (untuk auto-pick)
//   musikOn   : flag kanal musik on/off
//   volume    : 0..1
export async function applyMusic({ userMood, snapshot, musikOn, volume }) {
  if (!musikOn) {
    if (_activeMood !== null) {
      _activeMood = null;
      await playOnChannel(MUSIC_CHANNEL, null, 0, 600);
    }
    return null;
  }

  const targetMood = userMood === 'otomatis' || !userMood
    ? pickAutoMood(snapshot)
    : userMood;

  const def = MUSIC_MOODS[targetMood];
  if (!def) return null;

  if (_activeMood !== targetMood) {
    _activeMood = targetMood;
    await playOnChannel(MUSIC_CHANNEL, def.src, volume, 1200);
  } else {
    // Mood sama: cukup atur volume.
    setChannelVolume(MUSIC_CHANNEL, volume, 200);
  }
  return targetMood;
}

export function getActiveMood() { return _activeMood; }

// Untuk tombol "Test Sound" di OwnerAudioPanel.
export function testMusic(mood = 'cyberpunk', volume = 0.6) {
  const def = MUSIC_MOODS[mood];
  if (!def) return false;
  // Set _activeMood null supaya saat applyMusic dipanggil lagi nanti, akan
  // crossfade kembali ke mood asli.
  _activeMood = null;
  playOnChannel(MUSIC_CHANNEL, def.src, volume, 200);
  return true;
}
