# territorybook.github.io
# https://territorybook.github.io/
Congregation Territory Book Management Tool for Brothers.
The system is applicable for any library-like book-keeping applications.

index.html is the base file to be opened in a browser.

In the settings-tab one can 
  -create new books (Write "name" and click "Add new"), 
  -choose between different existing books by clicking their names,
  -save existing books to a JSON text-file ("Export JSON"), 
  -open existing savings from a JSON text-file ("Import JSON").
  Existing books may be
    -exported as a csv-file which may be opened with a spreadsheet program ("Export list"),
    -printed in a suitable form to distribute information for the peers ("Papers"),
    -studied as a timeline of numbers who represent the 'ages' of the territories ("Export plot" and open as a spreadsheet).

!!!!!!!  READ THIS CAREFULLY:
Although the scripts are designed to be local in such a way that none of 
the information is sent to a server, you should still take some serious 
precautions to PROTECT THE PRIVACY of the peers.
1)The database is stored at the client's browser's local memory which is wiped off
  each time the page is refreshed. This is a chosen feature for the script. 
  Save the database to your computer by "Export JSON" to avoid disasters.
2)The database file is by no means encrypted and anyone could restore all the information 
  just by reading the file. Hence NEVER EVER SEND THE DATABASE OR ANY OTHER FILE CONTAINING
  ANY NAMES USING EMAIL, INSTANT MESSAGING APPS OR ANY OTHER SERVICE ON THE INTERNET. 
  Use memory sticks instead. If internet is 'the only option' for some reason, use 
  the "Anonymize" button and send only the date information in an encrypted form 
  (search 'file encryption' or ask someone if you need assistance). We highly recommend 
  to store the database files in an encrypted form. Do not misplace them and remove obsolete
  copies.
3)Some exported files like the ones created by "Export list" -functionality include names.
  Point (2) applies to these cases also.
4)In some cases browsers or operating systems might send some ie. error reports to the
  companies' servers. This could be avoided by using the scripts totally off-the-grid.
5)We take no responsibility of anything related to the use of these scripts so 
  remember be careful and a bit paranoid as well.

Testing has been done using Chromium and Firefox browsers. 
The datepicker functionality is not included in Firefox so the behaviour is a bit different.
