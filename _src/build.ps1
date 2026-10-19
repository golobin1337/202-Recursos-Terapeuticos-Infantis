# Gera o script.js ofuscado (publicado) a partir de _src/script.js (legivel, nao publicado).
# Uso (PowerShell):  powershell -ExecutionPolicy Bypass -File _src\build.ps1
$root = Split-Path -Parent $PSScriptRoot
$src  = [IO.File]::ReadAllText((Join-Path $PSScriptRoot 'script.js'), [Text.Encoding]::UTF8)

# 1) minifica: remove linhas de comentario e indentacao
$lines = $src -split "`r?`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' -and -not $_.StartsWith('//') }
$code  = $lines -join "`n"

# 2) ofusca: XOR com chave aleatoria + base64, executado por um carregador pequeno
$bytes = [Text.Encoding]::UTF8.GetBytes($code)
$rng   = New-Object System.Random
$n     = $rng.Next(12, 24)
$key   = New-Object byte[] $n; $rng.NextBytes($key)
$out   = New-Object byte[] (1 + $n + $bytes.Length)
$out[0] = [byte]$n
[Array]::Copy($key, 0, $out, 1, $n)
for ($i = 0; $i -lt $bytes.Length; $i++) { $out[1 + $n + $i] = $bytes[$i] -bxor $key[$i % $n] }
$b64 = [Convert]::ToBase64String($out)

$v = { param($len) -join ((1..$len) | ForEach-Object { [char](97 + $rng.Next(26)) }) }
$a = & $v 5; $b = & $v 5; $c = & $v 5; $d = & $v 5; $s = & $v 5; $k = & $v 5; $i = & $v 4
$loader = "(function(){var $a=atob(`"$b64`"),$b=[],$i;for($i=0;$i<$a.length;$i++)$b.push($a.charCodeAt($i)&255);var $c=$b[0],$k=$b.slice(1,1+$c),$d=$b.slice(1+$c),$s='';for($i=0;$i<$d.length;$i++)$s+=String.fromCharCode($d[$i]^$k[$i%$c]);new Function(decodeURIComponent(escape($s)))();})();"

[IO.File]::WriteAllText((Join-Path $root 'script.js'), $loader, (New-Object Text.UTF8Encoding $false))
"script.js gerado: $($loader.Length) bytes"
