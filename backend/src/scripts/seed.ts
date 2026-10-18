import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { User } from '../models/User.js';
import { Item } from '../models/Item.js';
import { RequestModel } from '../models/Request.js';

export const seedData = async (force: boolean = false): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(config.mongoUri);
    }

    const userCount = await User.countDocuments();
    if (userCount > 0 && !force) {
      console.log('ℹ️ Database already has data. Skipping automatic seed.');
      return;
    }

    console.log('🌱 Seeding database with initial campus data...');

    if (force) {
      await Promise.all([
        User.deleteMany({}),
        Item.deleteMany({}),
        RequestModel.deleteMany({}),
      ]);
      console.log('🧹 Cleared existing collections.');
    }

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Lijashree',
      email: 'lijashree@college.edu',
      password: 'admin123',
      role: 'admin',
      phone: '9876543212',
      department: 'Computer Science & Engineering',
    });

    const user1 = await User.create({
      name: 'Krishnapriya',
      email: 'krishnapriya@college.edu',
      password: 'user123',
      role: 'user',
      phone: '9876543210',
      department: 'Information Technology',
    });

    const user2 = await User.create({
      name: 'Mithuna',
      email: 'mithuna@college.edu',
      password: 'user123',
      role: 'user',
      phone: '9876543211',
      department: 'Electronics & Communication',
    });

    console.log('✅ Created initial users: Admin Lijashree, Krishnapriya, Mithuna');

    // 2. Create Items
    const item1 = await Item.create({
      title: 'ASUS Laptop',
      description: 'ASUS laptop in excellent condition, perfect for programming and daily tasks. Includes charger and original box.',
      category: 'Laptops',
      quantity: 1,
      initialQuantity: 1,
      type: 'share',
      status: 'approved',
      imageUrl: '/src/imports/asus.jpeg',
      owner: user1._id,
      ownerName: user1.name,
      ownerPhone: user1.phone,
      location: 'CS Department, Room 301',
      timeSlot: '2:00 PM - 5:00 PM',
    });

    const item2 = await Item.create({
      title: 'HP Laptop Charger',
      description: 'Original HP charger, 65W, compatible with most HP laptop models. In perfect working condition.',
      category: 'Laptops',
      quantity: 2,
      initialQuantity: 2,
      type: 'share',
      status: 'approved',
      imageUrl: '/src/imports/hp.jpeg',
      owner: user2._id,
      ownerName: user2.name,
      ownerPhone: user2.phone,
      location: 'Library, Ground Floor',
      timeSlot: '10:00 AM - 1:00 PM',
    });

    const item3 = await Item.create({
      title: 'Ultrasonic Sensor HC-SR04',
      description: 'Ultrasonic distance sensor for Arduino/Raspberry Pi projects. Never used, brand new.',
      category: 'Project Components',
      subcategory: 'Sensors',
      quantity: 3,
      initialQuantity: 3,
      type: 'share',
      status: 'approved',
      imageUrl: '/src/imports/sensor.jpeg',
      owner: adminUser._id,
      ownerName: adminUser.name,
      ownerPhone: adminUser.phone,
      location: 'Electronics Lab, 2nd Floor',
      timeSlot: '3:00 PM - 6:00 PM',
    });

    const item4 = await Item.create({
      title: 'Raspberry Pi 4 Model B',
      description: 'Raspberry Pi 4 with 4GB RAM. Includes SD card with Raspbian OS pre-installed. Great for IoT projects.',
      category: 'Project Components',
      subcategory: 'Arduino',
      quantity: 1,
      initialQuantity: 1,
      type: 'share',
      status: 'approved',
      imageUrl: '/src/imports/ras.jpeg',
      owner: user1._id,
      ownerName: user1.name,
      ownerPhone: user1.phone,
      location: 'Makers Lab, Building B',
      timeSlot: '11:00 AM - 2:00 PM',
    });

    const item5 = await Item.create({
      title: 'HTML & CSS Book',
      description: 'Complete guide to HTML5 and CSS3. Perfect condition with no markings. Ideal for web development beginners.',
      category: 'Books',
      quantity: 2,
      initialQuantity: 2,
      type: 'donate',
      status: 'approved',
      imageUrl: '/src/imports/book.jpeg',
      owner: user2._id,
      ownerName: user2.name,
      ownerPhone: user2.phone,
      location: 'Main Library, Reference Section',
      timeSlot: '9:00 AM - 5:00 PM',
    });

    console.log('✅ Created initial campus items (approved and ready to browse)');

    // 3. Create Sample Requests
    await RequestModel.create({
      item: item1._id,
      itemTitle: item1.title,
      itemOwner: user1._id,
      requester: user2._id,
      requesterName: user2.name,
      requestedQuantity: 1,
      message: 'I need this for my final year project. Would be really helpful!',
      status: 'pending',
      termsAccepted: true,
      termsAcceptedAt: new Date(),
    });

    await RequestModel.create({
      item: item3._id,
      itemTitle: item3.title,
      itemOwner: adminUser._id,
      requester: user1._id,
      requesterName: user1.name,
      requestedQuantity: 2,
      message: 'Need for robotics project. Will return after semester.',
      status: 'approved',
      termsAccepted: true,
      termsAcceptedAt: new Date(),
    });

    console.log('✅ Seed completed successfully!');
  } catch (err: any) {
    console.error('❌ Error during seeding:', err.message);
  }
};

// If run directly from CLI
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedData(true).then(() => {
    console.log('Done.');
    process.exit(0);
  });
}
