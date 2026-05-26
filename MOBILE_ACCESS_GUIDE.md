# Mobile Access Guide

Paano i-access ang website sa phone mo kahit localhost lang.

## Option 1: Using ngrok (Recommended - Works anywhere)

### Steps:
1. **Double-click** ang `start-mobile-access.bat`
2. Hintayin ang ngrok tunnel (mga 5 seconds)
3. **Copy ang HTTPS URL** na lalabas (example: `https://xxxx-xx-xx.ngrok.io`)
4. **Open sa phone browser** ang URL na yan
5. Done! Pwede mo na i-access kahit iba WiFi

### Advantages:
- ✅ Works kahit iba WiFi network
- ✅ Secure HTTPS connection
- ✅ Pwede i-share sa iba
- ✅ No firewall issues

### Disadvantages:
- ❌ Kailangan naka-run ang script
- ❌ URL changes every restart (free version)

---

## Option 2: Using Local IP (Same WiFi only)

### Steps:
1. **Double-click** ang `get-local-ip.bat` para makita IP address mo
2. **Copy ang IPv4 Address** (example: `192.168.1.100`)
3. **Start backend server** normally: `cd backend && node index.js`
4. **Siguraduhin pareho kayo ng WiFi** (computer at phone)
5. **Open sa phone browser**: `http://[YOUR-IP]:3000`
   - Example: `http://192.168.1.100:3000`

### Advantages:
- ✅ Faster (direct connection)
- ✅ No third-party service
- ✅ Stable IP (usually)

### Disadvantages:
- ❌ Kailangan same WiFi network
- ❌ May need i-allow sa Windows Firewall
- ❌ IP might change

---

## Troubleshooting

### Ngrok Issues:
- **"command not found"** - Restart terminal or computer
- **"tunnel not found"** - Check if backend server is running on port 3000

### Local IP Issues:
- **"Cannot connect"** - Check Windows Firewall settings
- **"Connection refused"** - Make sure backend server is running
- **"Wrong IP"** - Run `get-local-ip.bat` again to verify

### Firewall Setup (for Local IP method):
1. Open **Windows Defender Firewall**
2. Click **"Allow an app through firewall"**
3. Find **Node.js** and check both Private and Public
4. If not found, click **"Allow another app"** and add Node.js

---

## Quick Reference

| Method | Command | Access From |
|--------|---------|-------------|
| ngrok | `start-mobile-access.bat` | Anywhere |
| Local IP | `get-local-ip.bat` + normal start | Same WiFi only |

---

## Notes:
- Backend server updated to accept external connections (`0.0.0.0`)
- Port 3000 is default (change in `.env` if needed)
- For frontend (Angular), may need separate configuration
