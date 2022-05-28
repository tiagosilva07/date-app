﻿using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public AccountController (DataContext context, ITokenService tokenService, IMapper mapper)
        {
            _context = context;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await UserExists(registerDto.userName)) return BadRequest("UserName is Taken");

            var user = _mapper.Map<AppUser>(registerDto);
           
            using var hmac = new HMACSHA512();

            user.UserName = registerDto.userName.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.password));
            user.PasswordSalt = hmac.Key;
          
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            

            return  new UserDto { 
                userName = user.UserName, 
                token =_tokenService.CreateToken(user) , 
                KnownAs = user.KnownAs };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            //Get the user from database
            var user = await _context.Users
                .Include(p=>p.Photos)
                .SingleOrDefaultAsync(x =>x.UserName == loginDto.userName.ToLower());
            //If there is no user
            if (user == null) return Unauthorized("Invalid username");

            //validate the entered password
            //Get the password salt saved in the database and add it to the algorithm key
            using var hmac = new HMACSHA512(user.PasswordSalt);
            //verify the hash generated by the user password insertion
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.password));
            // compare the hash generated with the password hash saved in the database 
            for(int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password");
            }

            return new UserDto {
                userName = user.UserName,
                token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs
            };

        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(user => user.UserName.ToLower() == username.ToLower());
        }
    }
}
