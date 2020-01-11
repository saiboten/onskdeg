import React from 'react';

export function Guardians() {
  // List ut verger
  // Skjema for å legge til verge
  return (
    <div>
      <h1>Konfigurer verger</h1>
      <form>
        <h2>Legg til verge</h2>
        <input type="text" value="Navn" name="name" />
        <input type="submit" value="OK" />
      </form>
      <h2>Eksisterende verger</h2>
      
    </div>
  );
}
