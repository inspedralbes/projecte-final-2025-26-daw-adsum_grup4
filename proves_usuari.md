# Resultats de les Proves d'Usuari - ADSUM

## 1. Perfil dels Testers
S'han realitzat proves amb usuaris que encaixen en el perfil objectiu de l'aplicació (alumnes i professors del centre):
- Usuari jove (<30 anys) amb coneixements tècnics i familiaritzat amb entorns web i ús de dispositius mòbils.
- Usuari adult (perfil professorat) amb coneixements bàsics-mitjans en eines de gestió escolar.

## 2. Percentatge de l'aplicació provada
S'ha provat aproximadament un **80% de les històries d'usuari principals**. 
Els fluxos testats inclouen:
- Sistema de Login (Frontend i Backend).
- Generació i lectura de codis QR per a l'assistència.
- Visualització del Dashboard de l'Alumne (historial, gamificació bàsica).
- Funcionalitats del Dashboard del Professor i Administrador.

## 3. Bugs detectats i Problemes d'Usabilitat
- **Bugs Detectats**: 
  - Alguns errors crítics al panell d'administrador en la gestió i registre d'usuaris nous.
  - Sincronització de les dades del "Passadís Digital" al sortir de l'aula.
- **Problemes d'Usabilitat**:
  - Poca claredat d'alguns indicadors d'estat (Present, Retard, Absent) en vistes ràpides.
  - El procés d'escaneig d'alguns QRs dinàmics podia ser poc intuïtiu la primera vegada en mòbils amb pantalles petites.

## 4. Possibilitats de millora i Idees
- **Possibilitats de millora**: 
  - Optimitzar el temps de càrrega de les estadístiques personals.
  - Millorar el disseny *responsive* sobretot per a l'ús de l'alumne des del telèfon mòbil (Mobile First).
- **Idees interessants**: 
  - Afegir notificacions Push o per correu quan un alumne canvia d'estat a "Absent".
  - Ampliar el sistema de gamificació per premiar l'assistència perfecta.
- **Idees dubtoses**: 
  - Forçar sempre la geolocalització pot generar rebuig o problemes tècnics en interiors a certes aules.

## 5. Conclusió i Propers Passos
Les proves ens han servit per validar que el flux principal (assistència amb QR vinculat a sessions) funciona i és ràpid.
En la pròxima fase del projecte (Sprint final), ens centrarem en:
1. Resoldre els bugs bloquejants referents a l'apartat d'Administració.
2. Polir la interfície d'usuari i la seva adaptació a dispositius mòbils.
3. Preparar el desplegament del projecte a un entorn final de Producció per la demostració final.
