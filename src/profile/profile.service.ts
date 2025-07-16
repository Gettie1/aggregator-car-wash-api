import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import * as Bcrypt from 'bcrypt';
// import { Role } from './entities/profile.entity';

// @Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}
  private async hashData(data: string): Promise<string> {
    const salt = await Bcrypt.genSalt(10);
    return Bcrypt.hash(data, salt);
  }
  private excludePassword(profile: Profile): Partial<Profile> {
    // Exclude 'password' and 'hashedRefreshToken' from the returned object
    const { password, hashedRefreshToken, ...profileWithoutPassword } = profile;
    return profileWithoutPassword;
  }
  async create(createProfileDto: CreateProfileDto): Promise<Partial<Profile>> {
    // Check if a profile with the same email already exists
    const existingProfile = await this.profileRepository.findOne({
      where: { email: createProfileDto.email }, // Ensure phone is also checked
      select: ['id'],
    });
    if (existingProfile) {
      throw new BadRequestException(
        `Profile with email ${createProfileDto.email} already exists`,
        // `Profile with phone ${createProfileDto.phone} already exists`,
      );
    }
    const newProfile: Partial<Profile> = {
      firstName: createProfileDto.firstName,
      lastName: createProfileDto.lastName,
      email: createProfileDto.email,
      phone: createProfileDto.phone, // Add the missing phone field
      password: await this.hashData(createProfileDto.password), // Hash the password
      role: createProfileDto.role,
    };
    // Create a new Profile entity
    const savedProfile = await this.profileRepository
      .save(newProfile)
      .then((profile) => {
        return profile;
      })
      .catch((error) => {
        console.error('Error creating profile:', error);
        throw new BadRequestException('Failed to create profile');
      });
    return this.excludePassword(savedProfile);
  }
  async findAll(email?: string): Promise<Partial<Profile>[]> {
    let profiles: Profile[];
    if (email) {
      profiles = await this.profileRepository.find({
        where: {
          email: email,
        },
      });
    } else {
      profiles = await this.profileRepository.find({
        // relations: ['studen'], // Ensure to load the student relation
      });
    }
    return profiles.map((profile) => this.excludePassword(profile));
  }
  async findOne(id: string): Promise<Partial<Profile>> {
    const profile = await this.profileRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return this.excludePassword(profile);
  }
  async update(
    id: string,
    updateProfileDto: Partial<CreateProfileDto>,
  ): Promise<Partial<Profile>> {
    const profile = await this.profileRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    // Update the profile with the new data
    Object.assign(profile, updateProfileDto);
    const updateProfile = await this.profileRepository.save(profile);
    return this.excludePassword(updateProfile);
  }
  async remove(id: string): Promise<string> {
    const profile = await this.profileRepository.findOne({
      where: { id: parseInt(id) },
      // relations: ['student'], // Ensure to load the student relation
    });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    await this.profileRepository.remove(profile);
    return `Profile with ID ${id} has been removed`;
  }
}
