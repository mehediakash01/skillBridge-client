import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { featuredTutors } from "@/src/lib/mock-data";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-primary/5 via-background to-background pb-16 pt-20 md:pt-32">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Connect with Expert Tutors
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Learn Anything
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground md:text-2xl">
            Find top-rated tutors for personalized 1-on-1 sessions. Book instantly and start learning today.
          </p>

          {/* Search bar */}
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Input
                  placeholder="Search subjects (Math, English, Programming...)"
                  className="h-14 pl-5 text-lg shadow-lg"
                />
              </div>
              <Button size="lg" className="h-14 px-8 text-lg">
                Find Tutors
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Popular: Mathematics • English • Programming • Physics • IELTS
            </p>
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Tutors</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Meet some of our highest-rated educators
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredTutors.map((tutor) => (
              <Card key={tutor.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-background">
                      <AvatarImage src={tutor.avatarUrl ?? ""} alt={tutor.name} />
                      <AvatarFallback>{tutor.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{tutor.name}</CardTitle>
                      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium">{tutor.averageRating}</span>
                        {/* <span>({tutor.reviewCount || "120+"})</span> */}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-6 pb-4">
                  <p className="line-clamp-3 text-sm text-muted-foreground">{tutor.bio}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {tutor.subjects.slice(0, 3).map((subject) => (
                      <Badge key={subject} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                    {tutor.subjects.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{tutor.subjects.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t px-6 py-4">
                  <div className="text-lg font-bold text-primary">
                    ${tutor.hourlyRate}
                    <span className="text-sm font-normal text-muted-foreground">/hr</span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/tutors/${tutor.id}`}>View Profile</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="gap-2">
              Browse All Tutors
              <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Simple Stats / Trust */}
      <section className="border-y bg-muted/40 py-16">
        <div className="container grid gap-8 text-center sm:grid-cols-3">
          <div>
            <div className="text-4xl font-bold text-primary">500+</div>
            <p className="mt-2 text-lg text-muted-foreground">Expert Tutors</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">10,000+</div>
            <p className="mt-2 text-lg text-muted-foreground">Sessions Completed</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">4.8/5</div>
            <p className="mt-2 text-lg text-muted-foreground">Average Rating</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center">
        <div className="container">
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Start Learning?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Join thousands of students who are achieving their goals with personalized tutoring.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <a href="/register?role=STUDENT">Sign Up as Student</a>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base" asChild>
              <a href="/register?role=TUTOR">Become a Tutor</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}