import React from 'react';
import { Music, Palette, Film } from 'lucide-react';

const songs = [
  { title: 'Os escravos de Jó', artist: 'Milton Nascimento e Clementina de Jesus' },
  { title: 'Canção do sal', artist: 'Milton Nascimento' },
  { title: 'Livre iniciativa', artist: 'Mundo Livre S/A' },
  { title: 'Inventor do trabalho', artist: 'Riachão, Batatinha e Panela' },
  { title: 'Sou boy', artist: 'Magazine' },
  { title: 'Como estamos? — Interlúdio', artist: 'Rashid' },
  { title: '9 to 5', artist: 'Dolly Parton' },
  { title: 'Working Class Hero', artist: 'John Lennon' },
  { title: 'Manic Monday', artist: '' },
  { title: 'Money', artist: '' },
  { title: 'She Works Hard for the Money', artist: 'Donna Summer' },
  { title: 'Construção', artist: 'Chico Buarque' },
  { title: 'Cotidiano', artist: '' },
  { title: 'Admirável Gado Novo', artist: 'Zé Ramalho' },
  { title: 'O Dia em que a Terra Parou', artist: 'Raul Seixas' },
];

const paintings = [
  { title: 'The Gleaners', note: '', reflection: '' },
  { title: 'The Potato Eaters', note: '', reflection: '' },
  { title: 'Detroit Industry Murals', note: '', reflection: '' },
  { title: 'The Iron Rolling Mill', note: '', reflection: '' },
  { title: 'The Third-Class Carriage', note: '', reflection: '' },
  { title: 'The Stone Breakers', note: 'destruída na Segunda Guerra Mundial', reflection: '' },
];

const films = [
  'Modern Times',
  'The Devil Wears Prada',
  'Office Space',
  'Up in the Air',
  'Sorry We Missed You',
  'Nomadland',
  'The Assistant',
  'The Intern',
  'Margin Call',
  'The Founder',
];

const ArteSection = () => {
  return (
    <section className="section-padding" id="arte">
      <div className="mb-10">
        <p className="font-poppins text-xs tracking-widest uppercase text-escutaris-terracota mb-2">
          Cultura e expressão
        </p>
        <h2 className="section-title">A arte é eixo essencial da Escutaris</h2>
      </div>

      {/* Músicas */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <Music size={20} className="text-escutaris-terracota flex-shrink-0" />
          <h3 className="font-poppins text-base font-semibold text-escutaris-verde uppercase tracking-wide">
            Músicas sobre o trabalho
          </h3>
        </div>
        <p className="font-poppins text-sm text-muted-foreground mb-6 ml-8">
          Ouça as músicas indicadas a seguir na sua plataforma preferida.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {songs.map((song, i) => (
            <div key={i} className="glass-card p-4 flex items-start gap-3">
              <span className="font-poppins text-xs font-bold text-escutaris-terracota mt-0.5 min-w-[1.5rem]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="font-poppins text-sm font-medium text-escutaris-verde leading-snug">
                  {song.title}
                </p>
                {song.artist && (
                  <p className="font-poppins text-xs text-muted-foreground mt-0.5">
                    {song.artist}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pinturas */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Palette size={20} className="text-escutaris-terracota flex-shrink-0" />
          <h3 className="font-poppins text-base font-semibold text-escutaris-verde uppercase tracking-wide">
            Pinturas sobre o trabalho
          </h3>
        </div>
        <div className="overflow-x-auto rounded-sm border border-border">
          <table className="w-full font-poppins text-sm">
            <thead>
              <tr className="bg-escutaris-verde/5 border-b border-border">
                <th className="text-left px-4 py-3 text-escutaris-verde font-semibold">Obra</th>
                <th className="text-left px-4 py-3 text-escutaris-verde font-semibold">Reflexão</th>
              </tr>
            </thead>
            <tbody>
              {paintings.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-border/50 last:border-0 hover:bg-escutaris-verde/5 transition-colors"
                >
                  <td className="px-4 py-3 text-escutaris-verde/90 align-top whitespace-nowrap">
                    {p.title}
                    {p.note && (
                      <span className="font-poppins text-xs text-muted-foreground ml-1.5">
                        ({p.note})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground align-top min-w-[200px]">
                    {p.reflection || (
                      <span className="text-muted-foreground/30 italic text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filmes */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Film size={20} className="text-escutaris-terracota flex-shrink-0" />
          <h3 className="font-poppins text-base font-semibold text-escutaris-verde uppercase tracking-wide">
            Filmes sobre o trabalho
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {films.map((film, i) => (
            <div key={i} className="glass-card p-4 flex items-center gap-3">
              <span className="font-poppins text-xs font-bold text-escutaris-terracota min-w-[1.5rem]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="font-poppins text-sm font-medium text-escutaris-verde">{film}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArteSection;
