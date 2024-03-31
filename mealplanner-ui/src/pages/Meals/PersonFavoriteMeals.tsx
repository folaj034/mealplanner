import { graphql } from "babel-plugin-relay/macro";
import { useRefetchableFragment, useFragment } from "react-relay";
import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { MealCard } from "./MealCard";
import { PersonFavoriteMeals_favorites$key } from "./__generated__/PersonFavoriteMeals_favorites.graphql";
import { useParams } from "react-router-dom";

export const FavoriteMealsFragment = graphql`
fragment PersonFavoriteMeals_favorites on Query
@argumentDefinitions(slug: { type: "String!" })
@refetchable(queryName: "PersonFavoriteMealsRefetchQuery") {
  gqLocalState {
    selectedFavoriteMeals
  }
  people (
    filter: {slug: {equalTo: $slug}}, 
    first: 1
  ) 
  {
    nodes {
      favoriteMeals {
        nodes {
          meal {
              rowId
              nameEn
              nameFr
              descriptionEn
              descriptionFr
              categories
              tags
              code
              photoUrl
              videoUrl
          }
        }
      }
    }
  }
}
`;

export const FavoriteMeals = ({ slug, favs }: {slug?:string, favs: PersonFavoriteMeals_favorites$key} ) => {
  const [meals, refetch] = useRefetchableFragment(FavoriteMealsFragment, favs);
  const params = useParams();
  slug = slug? slug: params.slug;
  useEffect(() => {
    refetch({ slug: slug });
  },[slug]);
  const favMeals = meals.people?.nodes[0].favoriteMeals.nodes;
  const selectedFavs: string[] = favMeals?.map(favMeal => favMeal.meal?.rowId) || [];

  return (
     <React.Fragment>
       { favMeals ? (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          marginTop="1rem"
          columns={4}
        >
          {favMeals.map((favMeal) => {
            if (favMeal.meal?.nameEn.toLowerCase())
              return <MealCard node={favMeal.meal} refetch={refetch} selectedFavs={selectedFavs}/>;
          })}
        </Grid>
      ) : (
        "No meals"
      )}
    </React.Fragment>
  )
}
