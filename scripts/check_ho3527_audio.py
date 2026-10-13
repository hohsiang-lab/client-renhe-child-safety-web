import hashlib, json, re, subprocess
from pathlib import Path

repo = Path(__file__).resolve().parents[1]
assets = repo / 'public/audio/ho3527-temp-free'
manifest = json.loads((assets / 'manifest.json').read_text())
assert len(manifest) == 20
assert len({row['identifier'] for row in manifest}) == 20
page = (repo / 'src/pages/TrustedAdultPage.tsx').read_text()
expected = re.findall(r'"/audio/ho3527-temp-free/([^"/]+)\.mp3"', page)
assert expected == [row['identifier'] for row in manifest]
labels = re.findall(r'\{ label: "([^"]+)", src: "/audio/ho3527-temp-free/[^"/]+\.mp3" \}', (repo / 'e2e/trusted-adult.spec.ts').read_text())
assert labels == [row['transcript'] for row in manifest]
for row in manifest:
    asset = assets / (row['identifier'] + '.mp3')
    assert hashlib.sha256(asset.read_bytes()).hexdigest() == row['sha256'], asset
    assert row['duration_seconds'] > 0 and row['license'] == 'Apache-2.0'
    subprocess.run(['ffmpeg', '-v', 'error', '-i', str(asset), '-f', 'null', '-'], check=True)
assert next(row for row in manifest if row['transcript'] == '113')['phonemes'] == ['ㄧ1/ㄧ1/ㄙㄢ1']
print('PASS: 20 exact mappings/transcripts, SHA256 and complete MP3 decode; hotline digit pronunciation')
