const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all courses (Guest accessible)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || !course.isPublished) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course' });
  }
});

// Admin ONLY: Create new Course
router.post('/', protect, authorize('Admin'), async (req, res) => {
  try {
    const course = new Course({ ...req.body, createdBy: req.user._id });
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Course not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/modules', protect, authorize('Admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const moduleData = {
      title: req.body.title,
      description: req.body.description || '',
      order: Number(req.body.order || course.modules.length + 1),
      lessons: req.body.lessons || [],
    };

    course.modules.push(moduleData);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id/modules/:moduleId', protect, authorize('Admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const moduleRef = course.modules.id(req.params.moduleId);
    if (!moduleRef) return res.status(404).json({ message: 'Module not found' });

    if (req.body.title !== undefined) moduleRef.title = req.body.title;
    if (req.body.description !== undefined) moduleRef.description = req.body.description;
    if (req.body.order !== undefined) moduleRef.order = req.body.order;
    if (req.body.lessons !== undefined) moduleRef.lessons = req.body.lessons;

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id/modules/:moduleId', protect, authorize('Admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const moduleRef = course.modules.id(req.params.moduleId);
    if (!moduleRef) return res.status(404).json({ message: 'Module not found' });

    moduleRef.deleteOne();
    await course.save();
    res.json({ message: 'Module removed', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;