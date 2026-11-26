export const characters = [
  {
    id: "alan", name: "Alan", alias: "El Becario", role: "The Intern", initials: "AL", color: "#ffc66d", image: "/wiki/alan.jpeg",
    summary: "Un mes de prácticas. Un clic equivocado. Toda una empresa por reparar.",
    personality: "Ingenuo, entusiasta y optimista hasta lo absurdo. Quiere demostrar que merece un puesto fijo, incluso cuando su bienvenida consiste en una silla floja y un manual de 300 páginas.",
    story: "Alan llega a Fix It Corp para hacer sus prácticas profesionales y firma todo lo que Recursos Humanos le pone enfrente, incluida una hoja en blanco. El lunes de su segunda semana abre un correo de «Telccel» que promete un iPhone gratis. El virus entra a la empresa, las laptops comienzan a incendiarse y los servidores amenazan con explotar. Ahora debe arreglar el desastre sin que sus jefes se enteren.",
  },
  {
    id: "steve", name: "Steve", alias: "El Pánico", role: "The Panic Expert", initials: "ST", color: "#ff9eae", image: "/wiki/steve.jpeg",
    summary: "Entra en pánico, pero nunca abandona su puesto.",
    personality: "Nervioso, dramático y exagerado. Para él, cualquier falla es el fin del mundo. Se lleva las manos a la cabeza, grita… y sigue reparando.",
    story: "Steve aparece en las historietas como el reflejo del caos de la oficina. Cuando algo sale mal, su expresión lo anuncia antes que nadie. Su reacción a las crisis es el contraste perfecto con la calma de Mark.",
  },
  {
    id: "mark", name: "Mark", alias: "El Redes", role: "The Network Guy", initials: "MK", color: "#69dff3", image: "/wiki/mark.jpeg",
    summary: "Entre cables, servidores y alarmas, él conserva la calma.",
    personality: "Tranquilo y casi indiferente. Mientras las laptops echan chispas, Mark apenas alza una ceja. Es el compañero más relajado del equipo.",
    story: "El encargado de redes vive rodeado de cables y servidores. El hackeo afecta directamente su especialidad, pero lo enfrenta con su calma habitual. Esa es la ironía de Mark: es el experto en redes de una empresa que acaba de ser hackeada.",
  },
  {
    id: "bill", name: "Bill", alias: "El Analista", role: "The Analyst", initials: "BI", color: "#baa7ff", image: "/wiki/bill.jpeg",
    summary: "Primero se analiza. Después se arregla.",
    personality: "Formal, serio, metódico y calculador. Ante una crisis, se ajusta los lentes y documenta lo que sucede antes de reaccionar.",
    story: "Bill es el veterano del departamento. Ha visto pasar a muchos becarios y jefes; en las historietas representa la voz silenciosa de la experiencia. Sabe que en Fix It Corp los problemas nunca se resuelven del todo.",
  },
];

export const tutorials = [
  { id: "reparacion", title: "El ciclo de reparación", category: "Lo esencial", image: "/wiki/tutorial_01.webp", description: "Sigue el recorrido de una laptop: recógela de la banda, consulta el diagnóstico, busca el componente y llévala a la mesa de reparación. Al terminar, entrégala en la salida.", alt: "Diagrama del recorrido de una laptop desde la banda de entrada, pasando por diagnóstico, almacén y reparación, hasta la salida." },
  { id: "pausa", title: "Una pausa en el taller", category: "Entre reparaciones", image: "/wiki/tutorial_02.webp", description: "La lámina muestra el recorrido desde el puesto de trabajo hasta la zona de comida y el regreso al taller. Consulta los botones que aparecen junto a cada acción.", alt: "Personaje que se desplaza desde el puesto de trabajo hasta una barra de comida y vuelve al taller." },
  { id: "incendios", title: "Actúa ante un incendio", category: "Emergencias", image: "/wiki/tutorial_03.webp", description: "Una reparación puede complicarse con el tiempo. Si la mesa se incendia, busca el extintor, llévalo hasta el fuego y apágalo para recuperar el puesto de trabajo.", alt: "Secuencia de una mesa de reparación que se incendia y un personaje que recoge y utiliza un extintor para apagarla." },
  { id: "servidores", title: "Protege los servidores", category: "Emergencias", image: "/wiki/tutorial_04.webp", description: "Los servidores también pueden incendiarse. La secuencia ilustra cómo recoger el extintor, acercarse al servidor y apagar el fuego.", alt: "Servidor con humo que se incendia y personaje que utiliza un extintor para devolverlo a su estado normal." },
  { id: "flujo", title: "El flujo de un vistazo", category: "Referencia rápida", image: "/wiki/pere_new.webp", description: "Consulta este esquema para ubicar el recorrido entre la entrada, el diagnóstico, las estaciones de trabajo y la salida. Las flechas indican cómo se conectan las acciones.", alt: "Esquema general con flechas entre la entrada de equipos, el diagnóstico, las estaciones de trabajo y la entrega final." },
];
