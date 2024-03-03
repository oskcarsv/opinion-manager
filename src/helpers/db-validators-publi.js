// Importar modelos necesarios
import Publication from '../publication/publication.model.js';


export const existePublicacionById = async (id = '') => {
    const existePublicacion = await Publication.findById(id);

    if (!existePublicacion) {
        throw new Error(`ID: ${id} Doesn't exist`);
    }
}
