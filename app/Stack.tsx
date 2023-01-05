import Image from "next/image";

import rubyOnRails from "../public/images/logos/rails-logo.svg";
import sidekiq from "../public/images/logos/sidekiq-logo.svg";
import rubocop from "../public/images/logos/rubocop-logo.svg";
import rspec from "../public/images/logos/rspec-logo.svg";
import react from "../public/images/logos/react-logo.svg";
import mui from "../public/images/logos/mui-logo.svg";
import nextjs from "../public/images/logos/nextjs-logo.svg";
import typescript from "../public/images/logos/typescript-logo.svg";
import heroku from "../public/images/logos/heroku-logo.svg";
import vercel from "../public/images/logos/vercel-logo.svg";
import posgres from "../public/images/logos/posgres-logo.svg";
import redis from "../public/images/logos/redis-logo.svg";
import reactNative from "../public/images/logos/react-native-logo.svg";
import expo from "../public/images/logos/expo-logo.svg";
import github from "../public/images/logos/github-logo.svg";
import nodejs from "../public/images/logos/nodejs-logo.svg";
import nestjs from "../public/images/logos/nestjs-logo.svg";
import graphql from "../public/images/logos/graphql-logo.svg";
import aws from "../public/images/logos/aws-logo.svg";
import serverless from "../public/images/logos/serverless-logo.svg";
import gem from "../public/images/gem.svg";
import paperCoffeeCup from "../public/images/paper-coffee-cup.svg";
import Logo from "./Logo";
import StackGroup from "./StackGroup";

export default function Stack() {
  return (
    <div className="relative flex flex-col justify-center">
      <div className="flex items-start justify-around">
        <Image
          src={paperCoffeeCup}
          alt="Paper coffee cup to go with scribbled name"
          className="max-xl:pt-8 xl:absolute xl:top-20 xl:-left-44"
        />
        <Image
          src={gem}
          alt="Decorative pink gem"
          className="xl:absolute xl:-right-32 xl:-top-8"
        />
      </div>
      <h2 className="bg-gradient-to-r from-[#d81746] to-[#fc45a8] bg-clip-text py-4 text-center font-serif text-5xl font-bold text-transparent">
        Nos armes de prédilection
      </h2>
      <p className="text-center">
        Le café et les gems ça vous parle ? Nous en sommes experts.
      </p>
      <div className="my-16 flex flex-col flex-wrap justify-center md:mx-8 md:max-xl:space-y-8 xl:flex-row xl:space-x-8">
        <div className="order-1 flex-[6_6_0%] p-8 md:rounded-3xl md:border-[1px] md:border-black">
          <h3 className="pb-3 font-serif text-2xl font-bold">
            Notre arsenal favori
          </h3>
          <p className="pb-8">
            Nous nous adaptons à votre stack technique, mais nous avons quelques
            préférences, en ligne avec nos valeurs.
          </p>
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:justify-between">
              <StackGroup title="Backend">
                <Logo
                  src={rubyOnRails}
                  title="Rails"
                  alt="Ruby on rails logo"
                />
                <Logo src={sidekiq} title="Sidekiq" alt="Sidekiq logo" />
                <Logo src={rubocop} title="Rubocop" alt="Rubocop logo" />
                <Logo src={rspec} title="RSpec" alt="RSpec logo" />
              </StackGroup>
              <StackGroup title="Base de données">
                <Logo src={posgres} title="Posgres" alt="PosgreSQL logo" />
                <Logo src={redis} title="Redis" alt="Redis logo" />
              </StackGroup>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between">
              <StackGroup title="Frontend">
                <Logo src={react} title="React" alt="React logo" />
                <Logo src={mui} title="Material UI" alt="Material UI logo" />
                <Logo src={nextjs} title="Next.js" alt="Next.js logo" />
                <Logo
                  src={typescript}
                  title="Typescript"
                  alt="Typescript logo"
                />
              </StackGroup>
              <StackGroup title="Apps mobile">
                <Logo
                  src={reactNative}
                  title="React Native"
                  alt="React Native logo"
                />
                <Logo src={expo} title="Expo" alt="Expo logo" />
              </StackGroup>
            </div>
            <StackGroup title="Hosting & Intégration Continue">
              <Logo src={heroku} title="Heroku" alt="Heroku logo" />
              <Logo src={vercel} title="Vercel" alt="Vercel logo" />
              <Logo src={github} title="Github Actions" alt="Github logo" />
            </StackGroup>
          </div>
        </div>
        <p className="order-1 px-8 text-zinc-400 xl:order-2 xl:mt-8">
          PS : Quelques sociétés utilisants Rails en technologie principale :
          Shopify, Airbnb, GitHub, Netflix, Doctolib, Swile...
        </p>
        <div className="order-1 flex-[4_4_0%] p-8 md:rounded-3xl md:border-[1px] md:border-black">
          <h3 className="pb-3 font-serif text-2xl font-bold">
            Dans nos cordes
          </h3>
          <p className="pb-8">
            Nous travaillons avec plaisir avec ces technologies plébiscitées par
            nos clients.
          </p>
          <div className="flex flex-col">
            <StackGroup title="Backend">
              <Logo src={nodejs} title="Node.js" alt="Node.js logo" />
              <Logo src={nestjs} title="NestJS" alt="NestJS logo" />
            </StackGroup>
            <StackGroup title="Frontend">
              <Logo src={graphql} title="GraphQL" alt="GraphQL logo" />
            </StackGroup>
            <StackGroup title="Infrastructure">
              <Logo src={aws} title="AWS" alt="AWS logo" />
              <Logo src={serverless} title="Serverless" alt="Serverless logo" />
            </StackGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
