export const exercises = [
  {
    id: 'box-breathing',
    title: 'Deep Breathing',
    subtitle: 'Box Breathing',
    tagline: 'Calms your nervous system in 5 minutes',
    difficulty: 'Beginner',
    duration: '5 min',
    animationType: 'breathing', // Used to determine which CSS animation to render
    icon: 'Wind', // Lucide icon reference
    color: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-500',
    description: 'A simple but powerful relaxation technique that aims to return breathing to its normal rhythm.',
    steps: [
      'Inhale slowly and deeply through your nose to the count of 4.',
      'Hold your breath for a slow count of 4.',
      'Exhale slowly through your mouth to the count of 4.',
      'Hold your breath again for a slow count of 4.',
      'Repeat the cycle for 5 minutes.'
    ],
    frequency: 'Do this 2-3x daily or whenever you feel overwhelmed.',
    pros: {
      mental: ['Reduces stress and anxiety instantly', 'Improves focus and concentration'],
      physical: ['Lowers blood pressure', 'Slows down heart rate'],
      bestFor: ['Anxiety attacks', 'Overthinking', 'Pre-sleep relaxation']
    },
    cons: {
      avoidIf: ['Severe respiratory issues (consult doctor first)'],
      mistakes: ['Breathing from the chest instead of the diaphragm', 'Rushing the counts'],
      whenNotToDo: ['While driving or operating machinery if it makes you dizzy']
    },
    science: 'Box breathing activates the parasympathetic nervous system (the "rest and digest" system), significantly reducing cortisol levels and the body\'s stress response.',
    reference: 'Based on techniques used by Navy SEALs for stress regulation.'
  },
  {
    id: 'pmr',
    title: 'Progressive Muscle Relaxation',
    subtitle: 'PMR',
    tagline: 'Releases physical tension step by step',
    difficulty: 'Beginner',
    duration: '10 min',
    animationType: 'pulse',
    icon: 'Activity',
    color: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-500',
    description: 'A technique that involves tensing and then deeply relaxing different muscle groups in the body.',
    steps: [
      'Find a comfortable, quiet place to sit or lie down.',
      'Take a few deep breaths to settle in.',
      'Starting with your toes, tense the muscles as tightly as you can for 5 seconds.',
      'Quickly release the tension and notice the feeling of relaxation for 10-15 seconds.',
      'Move up to your calves, thighs, abdomen, arms, neck, and face, repeating the process.'
    ],
    frequency: 'Practice once daily, preferably before bedtime.',
    pros: {
      mental: ['Reduces generalized anxiety', 'Helps manage insomnia and improves sleep quality'],
      physical: ['Relieves muscle tension and body aches', 'Can reduce frequency of tension headaches'],
      bestFor: ['Physical stress accumulation', 'Sleep troubles', 'Restlessness']
    },
    cons: {
      avoidIf: ['History of muscle spasms or severe injuries in specific areas (skip those areas)'],
      mistakes: ['Tensing to the point of pain', 'Forgetting to breathe while tensing'],
      whenNotToDo: ['Immediately after a heavy meal']
    },
    science: 'PMR helps you distinguish between feelings of tension and relaxation, effectively lowering the physical symptoms of anxiety and triggering a systemic relaxation response.',
    reference: 'Developed by American physician Edmund Jacobson in the 1920s.'
  },
  {
    id: 'light-jogging',
    title: 'Walking / Light Jogging',
    subtitle: 'Mindful Movement',
    tagline: 'Boosts endorphins and clears the mind',
    difficulty: 'Beginner',
    duration: '15-20 min',
    animationType: 'bounce',
    icon: 'Footprints',
    color: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-500',
    description: 'A gentle cardiovascular exercise focused on rhythmic movement and connecting with your surroundings.',
    steps: [
      'Wear comfortable shoes and clothing.',
      'Start with a slow, 5-minute warm-up walk.',
      'Transition into a brisk walk or light, comfortable jog.',
      'Focus on the rhythm of your feet and your breathing.',
      'Cool down with 5 minutes of slow walking.'
    ],
    frequency: '3-4 times a week for consistent mental health benefits.',
    pros: {
      mental: ['Releases endorphins (feel-good hormones)', 'Provides a break from repetitive overthinking'],
      physical: ['Improves cardiovascular health', 'Increases stamina and energy levels'],
      bestFor: ['Mild depression', 'Brain fog', 'Afternoon slumps']
    },
    cons: {
      avoidIf: ['Severe joint pain or mobility issues'],
      mistakes: ['Pushing too hard too fast', 'Looking down at your phone while walking'],
      whenNotToDo: ['In extreme weather conditions without proper gear']
    },
    science: 'Aerobic exercise increases blood circulation to the brain and promotes the release of endorphins, serotonin, and dopamine, which natural elevate mood.',
    reference: 'Extensively backed by psychiatric research for managing mild to moderate depression.'
  },
  {
    id: 'childs-pose',
    title: 'Yoga',
    subtitle: 'Child\'s Pose (Balasana)',
    tagline: 'A gentle resting pose to center yourself',
    difficulty: 'Beginner',
    duration: '2-5 min',
    animationType: 'stretch-down',
    icon: 'Heart',
    color: 'bg-rose-50 dark:bg-rose-900/20',
    iconColor: 'text-rose-500',
    description: 'A restorative yoga posture that gently stretches the lower back, hips, and thighs while calming the mind.',
    steps: [
      'Kneel on the floor with your toes together and knees hip-width apart.',
      'Exhale and lay your torso down between your thighs.',
      'Extend your arms forward or rest them alongside your body.',
      'Rest your forehead gently on the floor.',
      'Breathe deeply and hold for 1-3 minutes.'
    ],
    frequency: 'Whenever you feel stressed or need a quick mental reset.',
    pros: {
      mental: ['Creates a sense of safety and retreat', 'Soothes an overactive mind'],
      physical: ['Relieves lower back and neck tension', 'Gently stretches the hips and ankles'],
      bestFor: ['Sensory overload', 'Fatigue', 'Mid-day stress']
    },
    cons: {
      avoidIf: ['Knee injuries', 'Pregnancy (unless modifying with wide knees)'],
      mistakes: ['Forcing the hips to the heels if they don\'t reach naturally'],
      whenNotToDo: ['If you have acute diarrhea (can cause discomfort)']
    },
    science: 'Resting the forehead on the ground stimulates the vagus nerve, which signals the body to rest and reduces the fight-or-flight response.',
    reference: 'A foundational resting pose in traditional Hatha Yoga.'
  },
  {
    id: 'cat-cow',
    title: 'Yoga',
    subtitle: 'Cat-Cow Stretch',
    tagline: 'Releases spinal tension and improves focus',
    difficulty: 'Beginner',
    duration: '3 min',
    animationType: 'wave',
    icon: 'Activity',
    color: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-500',
    description: 'A gentle flow between two poses that warms the body and brings flexibility to the spine.',
    steps: [
      'Start on your hands and knees in a tabletop position.',
      'Cow Pose: Inhale, drop your belly towards the mat, and lift your chin and chest.',
      'Cat Pose: Exhale, draw your belly to your spine, and round your back toward the ceiling.',
      'Release your head toward the floor, but don\'t force your chin to your chest.',
      'Repeat the flow smoothly 5-10 times, matching movement with breath.'
    ],
    frequency: 'Daily, especially great in the morning or after sitting for long periods.',
    pros: {
      mental: ['Synchronizes breath and movement to calm the mind', 'Improves emotional balance'],
      physical: ['Improves posture and balance', 'Massages the organs in the belly'],
      bestFor: ['Stiffness from desk work', 'Morning grogginess', 'Mild anxiety']
    },
    cons: {
      avoidIf: ['Severe neck or wrist injuries'],
      mistakes: ['Crunching the neck backwards in Cow pose', 'Not linking the breath to the movement'],
      whenNotToDo: ['Directly on a hard surface if you have sensitive knees (use a blanket)']
    },
    science: 'The rhythmic motion improves spinal fluid circulation and releases endorphins, while the breath-syncing engages the parasympathetic nervous system.',
    reference: 'A staple warm-up in Vinyasa and Hatha Yoga.'
  },
  {
    id: 'neck-shoulder',
    title: 'Neck & Shoulder Stretch',
    subtitle: 'Tension Release',
    tagline: 'Quick relief from desk-induced stress',
    difficulty: 'Beginner',
    duration: '2 min',
    animationType: 'rotate',
    icon: 'User',
    color: 'bg-cyan-50 dark:bg-cyan-900/20',
    iconColor: 'text-cyan-500',
    description: 'Targeted stretches to relieve tension commonly stored in the upper back, shoulders, and neck.',
    steps: [
      'Sit or stand tall with relaxed shoulders.',
      'Gently drop your right ear toward your right shoulder. Hold for 15 seconds.',
      'Repeat on the left side.',
      'Roll your shoulders up, back, and down in a smooth circular motion 5 times.',
      'Clasp your hands behind your back and gently lift them away from your body to open the chest.'
    ],
    frequency: 'Multiple times a day, especially during work breaks.',
    pros: {
      mental: ['Breaks the physical cycle of stress', 'Promotes a feeling of lightness'],
      physical: ['Prevents tension headaches', 'Counteracts slouching and "tech neck"'],
      bestFor: ['Workplace stress', 'Headaches', 'After long drives or screen time']
    },
    cons: {
      avoidIf: ['Pinched nerves or herniated discs in the cervical spine'],
      mistakes: ['Pulling the head down with force', 'Hiking the opposite shoulder up'],
      whenNotToDo: ['If the stretch causes sharp, shooting pain rather than a dull pull']
    },
    science: 'Physical tension in the trapezius muscles is a direct physiological symptom of psychological stress. Releasing this tension provides biofeedback to the brain that the threat has passed.',
    reference: 'Recommended by physical therapists for ergonomic stress management.'
  },
  {
    id: 'jumping-jacks',
    title: 'Jumping Jacks / Body Shake',
    subtitle: 'Energy Reset',
    tagline: 'Shake off stagnant energy and frustration',
    difficulty: 'Beginner',
    duration: '1-2 min',
    animationType: 'shake',
    icon: 'Zap',
    color: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-500',
    description: 'A quick burst of intense movement to literally shake off built-up adrenaline and stress.',
    steps: [
      'Stand with your feet together and arms at your sides.',
      'Jump up while spreading your legs wide and bringing your arms above your head.',
      'Jump back to the starting position.',
      'Alternatively, just vigorously shake your arms, legs, and whole body loosely.',
      'Do this for 60 seconds.'
    ],
    frequency: 'As needed when feeling highly agitated or lethargic.',
    pros: {
      mental: ['Releases pent-up frustration and anger', 'Quickly shifts your mood state'],
      physical: ['Spikes heart rate for a quick cardiovascular boost', 'Wakes up the nervous system'],
      bestFor: ['Anger', 'Lethargy', 'Feeling "stuck" or frozen in anxiety']
    },
    cons: {
      avoidIf: ['Joint issues in knees or ankles', 'Pelvic floor dysfunction'],
      mistakes: ['Landing heavily on the heels', 'Holding your breath'],
      whenNotToDo: ['Late at night, as it may interfere with sleep']
    },
    science: 'Animals naturally "shake off" excess adrenaline after a stressful event. This exercise mimics that biological reset mechanism, completing the stress cycle.',
    reference: 'Somatic experiencing therapy techniques by Peter Levine.'
  },
  {
    id: 'legs-up-wall',
    title: 'Legs Up the Wall',
    subtitle: 'Viparita Karani',
    tagline: 'Ultimate relaxation and grounding',
    difficulty: 'Beginner',
    duration: '5-15 min',
    animationType: 'invert',
    icon: 'Moon',
    color: 'bg-indigo-50 dark:bg-indigo-900/20',
    iconColor: 'text-indigo-500',
    description: 'A restorative, passive inversion pose that promotes deep relaxation and improves circulation.',
    steps: [
      'Sit on the floor with your right side against a wall.',
      'Exhale and gently swing your legs up onto the wall as you lie back on the floor.',
      'Adjust your hips to be as close to the wall as is comfortable.',
      'Rest your arms out to the sides, palms facing up.',
      'Close your eyes, breathe naturally, and relax for 5-15 minutes.'
    ],
    frequency: 'Daily, excellent right before bed or after a long day on your feet.',
    pros: {
      mental: ['Deeply grounds the nervous system', 'Quiets internal chatter'],
      physical: ['Relieves tired legs and feet', 'Soothes swollen ankles'],
      bestFor: ['Insomnia', 'Exhaustion', 'High stress']
    },
    cons: {
      avoidIf: ['Glaucoma', 'High blood pressure (unmanaged)'],
      mistakes: ['Laying on a cold/hard floor without a mat or blanket', 'Forcing the hips flush to the wall if hamstrings are tight'],
      whenNotToDo: ['During menstruation (depending on personal comfort/tradition)']
    },
    science: 'Mild inversions reverse the effects of gravity on the cardiovascular system, reducing heart rate and signaling the brain to enter a state of deep relaxation.',
    reference: 'A classic restorative posture in Iyengar Yoga.'
  }
];
