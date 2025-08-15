-- Crea 20 guías ficticios sin avatar_url ni cover_url (se usarán fallbacks en frontend)
-- Ajusta owner_id para que corresponda a un usuario válido existente (auth.uid). Puedes hacer un SELECT previo.
-- Ejemplo para obtener un owner existente (manual):
-- SELECT id, email FROM auth.users LIMIT 5;

-- REEMPLAZA ESTE UUID por un user_id válido
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000000') THEN
    RAISE NOTICE 'Reemplaza el user_id placeholder en seed-20-guides.sql con uno existente de auth.users';
  END IF;
END $$;

-- Fallback de imagen esperado por el frontend (defínelo en código si no lo has hecho):
-- Avatar default: /images/pexels-pixabay-301738.jpg
-- Cover  default: /images/pexels-gasparzaldo-11250845.jpg

INSERT INTO public.guides (user_id,name,age,avatar_url,cover_url,bio,location,rating,total_reviews,languages,specialties,region_code,province_code,commune_code)
VALUES
  ('00000000-0000-0000-0000-000000000000','Matías Fuentes',34,NULL,NULL,'Guía especializado en lagos cordilleranos del norte de Chile.','San Pedro de Atacama, El Loa, Antofagasta',NULL,NULL,ARRAY['español','inglés'],ARRAY['pesca con mosca'], '02', NULL, NULL),
  ('00000000-0000-0000-0000-000000000000','Valentina Rojas',29,NULL,NULL,'Apasionada por los ríos rápidos del Maule y técnicas ultralivianas.','Talca, Talca, Maule',NULL,NULL,ARRAY['español'],ARRAY['ultraliviana'], '07', NULL, NULL),
  ('00000000-0000-0000-0000-000000000000','Ignacio Herrera',41,NULL,NULL,'Experto en fiordos y clima extremo, enfatiza seguridad y conservación.','Puerto Natales, Última Esperanza, Magallanes',NULL,NULL,ARRAY['español','inglés'],ARRAY['pesca embarcada','trolling'],'12',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Carolina Méndez',37,NULL,NULL,'Focalizada en zonas de desove y educación ambiental para principiantes.','Chillán, Diguillín, Ñuble',NULL,NULL,ARRAY['español'],ARRAY['iniciación','educativa'],'16',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Rodrigo Salazar',45,NULL,NULL,'Más de 20 años en lagos de la Araucanía; estrategias de mosca seca.','Pucón, Cautín, La Araucanía',NULL,NULL,ARRAY['español','portugués'],ARRAY['mosca seca','catch & release'],'09',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Fernanda Álvarez',32,NULL,NULL,'Especialista en corrientes claras y lectura de insectos.','Coyhaique, Coyhaique, Aysén',NULL,NULL,ARRAY['español','inglés'],ARRAY['entomología','mosca seca'],'11',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Patricio León',50,NULL,NULL,'Guía veterano de la cuenca del Río Bio-Bío; enfoque en conservación.','Los Ángeles, Biobío, Biobío',NULL,NULL,ARRAY['español'],ARRAY['conservación','flotadas'],'08',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Sofía Guzmán',27,NULL,NULL,'Promueve pesca responsable para jóvenes y familias.','Valdivia, Valdivia, Los Ríos',NULL,NULL,ARRAY['español','inglés'],ARRAY['familiar','principiantes'],'14',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Esteban Araya',39,NULL,NULL,'Conocedor de estuarios y mareas en la zona central.','Concón, Valparaíso, Valparaíso',NULL,NULL,ARRAY['español'],ARRAY['estuario','spinning'],'05',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Daniela Pino',31,NULL,NULL,'Integra trekking ligero con experiencias de pesca en altura.','San Fabián, Punilla, Ñuble',NULL,NULL,ARRAY['español'],ARRAY['trekking','alta montaña'],'16',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Gonzalo Vera',43,NULL,NULL,'Prácticas avanzadas de streamer en ríos caudalosos.','Futrono, Ranco, Los Ríos',NULL,NULL,ARRAY['español'],ARRAY['streamer','grandes truchas'],'14',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Camila Donoso',36,NULL,NULL,'Experiencias personalizadas en lagunas altoandinas.','San José de Maipo, Cordillera, Metropolitana',NULL,NULL,ARRAY['español','inglés'],ARRAY['altiplano','personalizadas'],'13',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Felipe Contreras',48,NULL,NULL,'Referencia local en pesca de salmón Chinook en la Patagonia.','Aysén, Aysén, Aysén',NULL,NULL,ARRAY['español'],ARRAY['salmón','drift'],'11',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','María José Palma',28,NULL,NULL,'Enfocada en experiencias cortas para viajeros express.','La Serena, Elqui, Coquimbo',NULL,NULL,ARRAY['español','inglés'],ARRAY['half-day','urbana'],'04',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Hernán Sepúlveda',52,NULL,NULL,'Leyendas y relatos culturales combinados con pesca recreativa.','Temuco, Cautín, La Araucanía',NULL,NULL,ARRAY['español'],ARRAY['cultural','histórica'],'09',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Josefina Vidal',33,NULL,NULL,'Guía enfocada en grupos pequeños y fotografía.','Puerto Varas, Llanquihue, Los Lagos',NULL,NULL,ARRAY['español','inglés'],ARRAY['fotografía','grupos pequeños'],'10',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Mauricio Ortega',38,NULL,NULL,'Especialista en ninfas europeas en aguas cristalinas.','Lonquimay, Malleco, La Araucanía',NULL,NULL,ARRAY['español'],ARRAY['euro nymphing'],'09',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Antonia Ibáñez',26,NULL,NULL,'Experiencias de aprendizaje rápido para viajeros principiantes.','Puerto Aysén, Aysén, Aysén',NULL,NULL,ARRAY['español','inglés'],ARRAY['bootcamp','principiantes'],'11',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Luis Farías',47,NULL,NULL,'Pesca embarcada y lectura avanzada de ecosondas.','Quellón, Chiloé, Los Lagos',NULL,NULL,ARRAY['español'],ARRAY['embarcada','sonar'],'10',NULL,NULL),
  ('00000000-0000-0000-0000-000000000000','Paula Reyes',35,NULL,NULL,'Itinerarios premium con enfoque gastronómico.','Castro, Chiloé, Los Lagos',NULL,NULL,ARRAY['español','inglés'],ARRAY['premium','gastronómica'],'10',NULL,NULL)
ON CONFLICT (user_id,name) DO NOTHING;
