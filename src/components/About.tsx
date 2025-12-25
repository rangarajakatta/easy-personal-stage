const About = () => {
  const stats = [
    { value: "5+", label: "Years Experience" },
    { value: "50+", label: "Projects Completed" },
    { value: "30+", label: "Happy Clients" },
  ];

  return (
    <section id="about" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden card-gradient border border-border">
              <div className="w-full h-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
                <span className="font-display text-8xl text-muted-foreground/20">JD</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 border-2 border-primary/30 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div>
            <p className="text-primary font-medium mb-4">About Me</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Turning Ideas Into{" "}
              <span className="text-gradient italic">Digital Reality</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-10">
              <p>
                I'm a passionate developer and designer with over 5 years of experience 
                in creating beautiful, functional digital products. My journey started 
                with a curiosity for how things work on the web, and it has evolved into 
                a career dedicated to crafting exceptional user experiences.
              </p>
              <p>
                I believe in the power of clean code and thoughtful design. Every project 
                I take on is an opportunity to push boundaries and deliver something that 
                not only looks great but also performs flawlessly.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="font-display text-4xl font-bold text-gradient mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
