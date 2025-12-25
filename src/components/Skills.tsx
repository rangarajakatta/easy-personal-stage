const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
    },
    {
      title: "Backend",
      skills: ["Node.js", "Python", "PostgreSQL", "GraphQL", "REST APIs"],
    },
    {
      title: "Design",
      skills: ["Figma", "UI/UX", "Prototyping", "Design Systems", "Animation"],
    },
    {
      title: "Tools",
      skills: ["Git", "Docker", "AWS", "Vercel", "CI/CD"],
    },
  ];

  return (
    <section id="skills" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-4">What I Do</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Skills & <span className="text-gradient italic">Expertise</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="p-6 card-gradient border border-border rounded-2xl hover:border-primary/50 transition-colors group"
            >
              <h3 className="font-display text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <ul className="space-y-2">
                {category.skills.map((skill, skillIndex) => (
                  <li
                    key={skillIndex}
                    className="text-muted-foreground text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
