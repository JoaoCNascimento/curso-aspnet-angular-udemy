using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProAgil.Repository;
using ProAgil.Domain;
using AutoMapper;
using ProAgil.API.Dtos;

namespace ProAgil.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        private readonly IProAgilRepository repo;
        private readonly IMapper mapper;
        public EventoController(IProAgilRepository repo, IMapper mapper)
        {
            this.repo = repo;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await repo.GetAllEventosAsync(true);
                
                var results = mapper.Map<EventoDTO[]>(eventos);
                
                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro no banco de dados.{ex.Message}");
            }
        }

        [HttpGet("{EventoId}")]
        public async Task<ActionResult> Get(int EventoId)
        {
            try
            {
                var evento = await repo.GetEventoAsyncById(EventoId, true);

                var result = mapper.Map<EventoDTO>(evento);

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
        public async Task<IActionResult> Post(EventoDTO model)
        {
            try 
            {
                var evento = this.mapper.Map<Evento>(model);

                repo.Add(evento);

                if(await repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", mapper.Map<EventoDTO>(evento));
                }
            }
            catch(System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados." + ex.Message);
            }

            return BadRequest();
        }

        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId, EventoDTO model)
        {
            try 
            {
                var evento = await repo.GetEventoAsyncById(EventoId, false);

                if(evento == null) return NotFound();

                mapper.Map(model, evento);

                repo.Update(evento);

                if(await repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", mapper.Map<EventoDTO>(evento));
                }
            }
            catch(System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados.");
            }

            return BadRequest();
        }

        [HttpDelete("{EventoId}")]
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