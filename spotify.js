// Fungsi untuk mendapatkan token akses
function getAccessToken() {
    const hash = window.location.hash.substring(1).split('&').reduce((initial, item) => {
        if (item) {
            const parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
    window.location.hash = '';
    return hash.access_token;
}

const token = getAccessToken();

if (token) {
    document.getElementById('play-button').style.display = 'block';

    window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new Spotify.Player({
            name: 'Web Playback SDK Player',
            getOAuthToken: cb => { cb(token); },
            volume: 0.5,
        });

        // Ready
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            setActiveDevice(device_id);
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.addListener('player_state_changed', state => {
            if (!state) {
                console.log('No state available');
                return;
            }
            
            // Ambil informasi lagu yang sedang diputar
            const track = state.track_window.current_track;
            const trackName = track.name;
            const artistName = track.artists.map(artist => artist.name).join(', ');
        
            // Tampilkan informasi lagu
            const currentTrackElement = document.getElementById('current-track');
            currentTrackElement.textContent = `Now Playing: ${trackName} by ${artistName}`;
            currentTrackElement.style.display = 'block'; // Tampilkan elemen
            console.log('Player state changed:', state);
        });

        player.connect();

        document.getElementById('play-button').addEventListener('click', () => {
            playSong('spotify:track:2CGNAOSuO1MEFCbBRgUzjd'); // Ganti dengan URI lagu Anda
        });
    };

    function setActiveDevice(device_id) {
        fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                device_ids: [device_id],
                play: true,
            }),
        }).then(response => {
            if (!response.ok) {
                console.error('Failed to set active device:', response.statusText);
            } else {
                console.log('Device set as active');
            }
        });
    }

    function playSong(uri) {
        console.log('Mencoba memutar lagu dengan URI:', uri);
        fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uris: [uri] }) // Pastikan ini benar
        }).then(response => {
            if (!response.ok) {
                console.error('Gagal memutar lagu:', response.statusText);
            } else {
                console.log('Pemutaran dimulai');
            }
        });
    }
} else {
    document.getElementById('login-button').addEventListener('click', () => {
        const client_id = 'acf11dc059ab44769db02ef07c56f11f';
        const redirect_uri = 'http://localhost/kbp_uas/index.html';
        const scope = 'user-read-playback-state user-modify-playback-state streaming';

        const url = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=token&show_dialog=true`;

        window.location = url;
    });
}
