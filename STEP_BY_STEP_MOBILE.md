# 📱 Step-by-Step: I-access sa Phone

## SIMPLENG PARAAN (5 Steps Lang!)

### Step 1: Hanapin ang File
```
Pumunta sa folder: C:\Users\Kevin Dizon\kevin-pogi\
Hanapin ang file na: start-mobile-access.bat
```

### Step 2: Double-Click
```
Double-click lang ang start-mobile-access.bat
Makikita mo 2 windows:
  - Window 1: Backend Server (hayaan mo lang bukas)
  - Window 2: ngrok (may URL dito)
```

### Step 3: Copy ang URL
```
Sa ngrok window, hanapin ang line na:
  "Forwarding    https://xxxx-xx-xx.ngrok.io -> http://localhost:3000"

Copy ang HTTPS URL (yung https://xxxx-xx-xx.ngrok.io)
```

### Step 4: Open sa Phone
```
1. Kunin ang phone mo
2. Open any browser (Chrome, Safari, etc.)
3. Paste ang URL na na-copy mo
4. Press Enter/Go
```

### Step 5: Done! 🎉
```
Makikita mo na ang website sa phone mo!
```

---

## VISUAL GUIDE

### Ano ang Makikita Mo:

#### Sa Computer (Window 1 - Backend):
```
Server is running on port 3000
Access from other devices using your IP address
Database connection successful!
Database tables synced!
```
✅ Hayaan mo lang bukas ito!

#### Sa Computer (Window 2 - ngrok):
```
ngrok

Session Status                online
Account                       [your account]
Forwarding                    https://1234-56-78.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```
📋 Copy ang URL: `https://1234-56-78.ngrok.io`

#### Sa Phone Browser:
```
Address bar: https://1234-56-78.ngrok.io
```
✅ Lalabas na ang website mo!

---

## TROUBLESHOOTING

### Problem: "ngrok not found"
**Solution:** Restart computer mo, then try again

### Problem: "Connection refused"
**Solution:** 
1. Close lahat ng windows
2. Run ulit ang start-mobile-access.bat
3. Hintayin 10 seconds bago i-access sa phone

### Problem: "Backend error"
**Solution:**
1. Check kung naka-on ang MySQL/database mo
2. Check ang .env file sa backend folder

### Problem: "Blank page sa phone"
**Solution:**
- Check kung tama ang URL (dapat may https://)
- Try i-refresh ang page
- Check kung may internet connection ang phone

---

## ALTERNATIVE: Kung ayaw gumana ang ngrok

### Gamitin ang Local IP (Same WiFi lang):

1. **Double-click** ang `get-local-ip.bat`
2. **Makikita mo ang IP** (example: `192.168.1.100`)
3. **Manually start backend:**
   ```
   cd backend
   node index.js
   ```
4. **Sa phone** (dapat same WiFi):
   ```
   http://192.168.1.100:3000
   ```

---

## QUICK REFERENCE

| Tanong | Sagot |
|--------|-------|
| Anong file ang i-run? | `start-mobile-access.bat` |
| Saan ko makikita ang URL? | Sa ngrok window (https://...) |
| Ilang windows ang bubuksan? | 2 windows (backend + ngrok) |
| Pwede ko ba i-close? | Huwag! Kailangan bukas habang ginagamit |
| Paano i-stop? | Close lang ang 2 windows |
| Pwede ba kahit iba WiFi? | Yes! Yan ang advantage ng ngrok |

---

## TIPS

✅ **Save ang URL** - Pwede mo i-bookmark sa phone
✅ **Keep windows open** - Huwag i-close habang ginagamit
✅ **Share sa iba** - Pwede mo i-share ang URL sa classmates/friends
✅ **Restart if needed** - Kung may problema, close lahat then run ulit

---

## NEED HELP?

Kung may problema pa rin:
1. Screenshot ang error
2. Check kung naka-on ang database
3. Try i-restart ang computer
4. Run ulit ang start-mobile-access.bat
