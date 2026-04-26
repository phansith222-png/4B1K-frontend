import axios from 'axios';

async function check() {
  try {
    const res = await axios.get('http://localhost:5000/artists'); 
    const artists = res.data.artists || res.data;
    const targets = artists.filter(a => a.artistName.toLowerCase().includes('snake') || a.artistName.toLowerCase().includes('calvin'));
    targets.forEach(a => {
      console.log(`Artist: ${a.artistName}`);
      console.log(`Image: ${a.profileImage}`);
    });
  } catch(e) {
    console.error(e.message);
  }
}
check();
