using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required] public string userName { get; set; }
        [Required] public string knownAs { get; set; }
        [Required] public string Gender { get; set; }
        [Required] public DateTime DateOfBirth { get; set; }
        [Required] public string City { get; set; }
        [Required] public string Country { get; set; }


        [Required]
        [StringLength(15, MinimumLength = 8)]
        public string password { get; set; }
    }
}
