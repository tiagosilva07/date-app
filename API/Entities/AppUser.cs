﻿namespace API.Entities
{
    public class AppUser
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        
    }
}
