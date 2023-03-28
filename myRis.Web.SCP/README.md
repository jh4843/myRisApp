# myRis.Web.SCP

## Register dicom service as a window service

```
On cmd with 'Admin Previl'., sc.exe create "name of the service" binpath="full path to the .exe file"
ex)
[SERVICE CREATE / DELETE]
sc.exe create ".NET SERVICE" binpath="D:\SVN\myRis.Web\myRis.Web.Scp\Bins\Debug\myRis.Web.Scp.Service.exe"
sc.exe delete ".NET SERVICE" (���� ���¿��� �ؾ��� or �����Ǿ��ٰ� �����µ� ���� �ִ� ��찡 ����)

[SERVICE START / STOP]
net start ".NET SERVICE"
net stop ".NET SERVICE"

[���� �������϶� Ȯ��]
tasklist /FI "SERVICES eq .NET SERVICE"

[���� ���������ϱ�]
taskkill /F /FI "SERVICES eq .NET SERVICE"

```
