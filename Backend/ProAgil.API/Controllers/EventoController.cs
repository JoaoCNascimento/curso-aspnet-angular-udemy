using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProAgil.Repository;
using ProAgil.Domain;

namespace ProAgil.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        private readonly IProAgilRepository repo;
        public EventoController(IProAgilRepository repo)
        {
            this.repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var results = await repo.GetAllEventosAsync(true);
                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados.");
            }
        }

        [HttpGet("{EventoId}")]
        public async Task<ActionResult> Get(int EventoId)
        {
            try
            {
                var result = await repo.GetEventoAsyncById(EventoId, true);

                if (result == null)
                {
                    return this.StatusCode(StatusCodes.Status404NotFound, "Evento não encontrado");
                }

                return Ok(result);
            }
            catch (SystemException)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados.");
            }
        }

        [HttpGet("getByTema/{Tema}")]
        public async Task<ActionResult> Get(string Tema)
        {
            try
            {
                var result = await repo.GetAllEventosAsyncByTema(Tema, true);

                if (result == null)
                {
                    return this.StatusCode(StatusCodes.Status404NotFound, "Evento não encontrado");
                }

                return Ok(result);
            }
            catch (SystemException)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(Evento model)
        {
            try 
            {
                repo.Add(model);

                if(await repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", model);
                }
            }
            catch(System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados.");
            }

            return BadRequest();
        }

        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId, Evento model)
        {
            try 
            {
                var evento = await repo.GetEventoAsyncById(EventoId, false);

                if(evento == null) 
                {
                    return NotFound();
                }

                repo.Update(model);

                if(await repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", model);
                }
            }
            catch(System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados.");
            }

            return BadRequest();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int EventoId)
        {
            try 
            {
                var evento = await repo.GetEventoAsyncById(EventoId, false);

                if(evento == null) 
                {
                    return NotFound();
                }

                repo.Delete(evento);

                if(await repo.SaveChangesAsync())
                {
                    return Ok();
                }
            }
            catch(System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados.");
            }

            return BadRequest();
        }
    }
}