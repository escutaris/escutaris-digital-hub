-- Migrar todas as ferramentas para categoria 'material'
UPDATE materials 
SET category = 'material' 
WHERE category = 'ferramenta';

-- Migrar todas as legislações para categoria 'material' 
UPDATE materials 
SET category = 'material' 
WHERE category = 'legislacao';