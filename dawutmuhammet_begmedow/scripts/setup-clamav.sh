#!/bin/bash
# ============================================
# Setup ClamAV Portable for VirusDetect Pro
# Run this ONCE before building the .exe
# ============================================

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
CLAMAV_DIR="$PROJECT_DIR/clamav"

echo "============================================"
echo "  ClamAV Portable Setup for VirusDetect Pro"
echo "============================================"
echo ""

# Create clamav directory
mkdir -p "$CLAMAV_DIR"

# Check if ClamAV is already installed on the system
if command -v clamscan &> /dev/null; then
    echo "[OK] ClamAV is installed on this system"
    echo "     Path: $(which clamscan)"
    echo "     Version: $(clamscan --version 2>/dev/null)"
    echo ""
    echo "For Windows build, you need ClamAV Windows binaries."
    echo ""
fi

echo "=== INSTRUCTIONS ==="
echo ""
echo "To bundle ClamAV with the Windows .exe installer:"
echo ""
echo "1. Download ClamAV for Windows from:"
echo "   https://www.clamav.net/downloads#otherversions"
echo "   (Get the .msi or .zip for Win64)"
echo ""
echo "2. Extract/install and copy these files to: $CLAMAV_DIR/"
echo "   - clamscan.exe"
echo "   - libclamav.dll"
echo "   - libclammspack.dll"
echo "   - libclamunrar.dll"
echo "   - libclamunrar_iface.dll"
echo "   - libbz2.dll"
echo "   - libcrypto-3-x64.dll"
echo "   - libjson-c.dll"
echo "   - libpcre2-8.dll"
echo "   - libssl-3-x64.dll"
echo "   - libxml2.dll"
echo "   - pthreadVC3.dll"
echo ""
echo "3. Download virus databases (run on Windows or copy from a Windows machine):"
echo "   freshclam.exe --datadir=\"$CLAMAV_DIR/db\""
echo ""
echo "   Or download manually:"
echo "   - https://database.clamav.net/main.cvd     -> $CLAMAV_DIR/db/main.cvd"
echo "   - https://database.clamav.net/daily.cvd     -> $CLAMAV_DIR/db/daily.cvd"
echo "   - https://database.clamav.net/bytecode.cvd   -> $CLAMAV_DIR/db/bytecode.cvd"
echo ""
echo "4. After setup, build with:"
echo "   npm run build:win"
echo ""

# Create a minimal config for bundled ClamAV
mkdir -p "$CLAMAV_DIR/db"
cat > "$CLAMAV_DIR/clamd.conf" << 'EOF'
# ClamAV config for VirusDetect Pro (portable)
DatabaseDirectory db
LogFile clamd.log
EOF

echo "[OK] Directory structure created at: $CLAMAV_DIR/"
echo ""
echo "Current contents:"
ls -la "$CLAMAV_DIR/" 2>/dev/null
echo ""

# Check if databases exist
if [ -f "$CLAMAV_DIR/db/main.cvd" ]; then
    echo "[OK] Virus databases found"
else
    echo "[!] Virus databases NOT found yet"
    echo "    Follow instructions above to download them"
fi
