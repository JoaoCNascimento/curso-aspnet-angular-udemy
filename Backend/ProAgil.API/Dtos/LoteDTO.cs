using System;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.API.Dtos 
{
    public class LoteDTO 
    {
        public int Id { get; set; }

        [StringLength(50, MinimumLength = 3, ErrorMessage = "O nome do lote deve ter entre 3 e 50 caracteres.")]
        public string Nome { get; set; }

        [Required (ErrorMessage = "O preço é obrigatório.")]
        public decimal Preco { get; set; }

        [Required (ErrorMessage = "A data de início é obrigatória.")]
        public string? DataInicio { get; set; }

                [Required (ErrorMessage = "A data de fim é obrigatória.")]
        public string? DataFim { get; set; }

        [Range(2, 120000)]
        public int Quantidade { get; set; }
    }
}