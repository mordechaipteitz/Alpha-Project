Vue.component('product', {

  template: `
    <div class="product">
      <searchBar :favorites="favorites"></searchBar>
    </div>
    `,

    data() {
      return {
        favorites: [],
        product: 'Beers'
      }
    },


})

Vue.component('searchBar', {
  props: {
    favorites: Array
  },

  template: `
    <div>
      <div id="searchBars">
        <div id="randomBar">
          <form @submit.prevent="getRandom">
            <input type="submit" value="Get 10 Random Beers">
          </form>
        </div>

        <div id="paramBar">
          <p v-if="errors.length">
             <li v-for="error in errors">{{ error }}</li>
          </p>

          <form @submit.prevent="getSpecified">
            <p>
              <label for="abv">Max ABV (Alcohol by Volume)</label>
              <input v-model.number="abv">
            </p>

            <p>
              <label for="ibu">Max IBU (International Bitterness Units)</label>
              <input v-model.number="ibu">
            </p>

            <p>
              <input type="submit" value="Get Specified Beers">
            </p>
          </form>
        </div>
      </div>

      <beerList :favorites="favorites" :beers="beers"></beerList>
    </div>
  `,

  data() {
    return {
      abv: null,
      ibu: null,
      beers: [],
      errors: []
    }
  },

  methods: {
    getRandom() {
      this.beers = [];
      this.errors = [];
      for (let i = 0; i < 10; i++) {
        fetch('https://api.punkapi.com/v2/beers/random')
          .then(response => response.json())
          .then(json => {
            let beer = {
              name: json[0].name,
              abv: json[0].abv,
              ibu: json[0].ibu,
              favorite: false
            }

            for (let j = 0; j < this.favorites.length; j++) {
              if (this.favorites[j].name === beer.name) {
                beer.favorite = true;
              }
            }
            this.beers.push(beer);
        })
      }
    },

    getSpecified() {
      this.beers = [];
      this.errors = [];
      if (this.abv && this.ibu) {
        fetch(`https://api.punkapi.com/v2/beers?abv_lt=${this.abv}&ibu_lt=${this.ibu}`)
          .then(response => response.json())
          .then(json => {
            for (let i = 0; i < json.length; i++) {
              let beer = {
                name: json[i].name,
                abv: json[i].abv,
                ibu: json[i].ibu,
                favorite: false
              }

              for (let j = 0; j < this.favorites.length; j++) {
                if (this.favorites[j].name === beer.name) {
                  beer.favorite = true;
                }
              }
              this.beers.push(beer);
            }
          })
      }

      else if (this.abv) {
        fetch(`https://api.punkapi.com/v2/beers?abv_lt=${this.abv}`)
          .then(response => response.json())
          .then(json => {
            for (let i = 0; i < json.length; i++) {
              let beer = {
                name: json[i].name,
                abv: json[i].abv,
                ibu: json[i].ibu,
                favorite: false
              }

              for (let j = 0; j < this.favorites.length; j++) {
                if (this.favorites[j].name === beer.name) {
                  beer.favorite = true;
                }
              }
              this.beers.push(beer);
            }
          })
      }

      else if (this.ibu) {
        fetch(`https://api.punkapi.com/v2/beers?ibu_lt=${this.ibu}`)
          .then(response => response.json())
          .then(json => {
            for (let i = 0; i < json.length; i++) {
              let beer = {
                name: json[i].name,
                abv: json[i].abv,
                ibu: json[i].ibu,
                favorite: false
              }

              for (let j = 0; j < this.favorites.length; j++) {
                if (this.favorites[j].name === beer.name) {
                  beer.favorite = true;
                }
              }
              this.beers.push(beer);
            }
          })
      }

      else {
        this.errors.push("At least one parameter is required.")
      }
    },
  }
})

Vue.component('beerList', {
  props: {
    beers: Array,
    favorites: Array
  },

  template: `
    <div id="beerLists">
      <div id="batchList">

        <h3 v-if="beers.length">Beer Batch</h3>

        <ul>
          <li v-for="beer in beers"><button v-on:click="toggleFavorite(beer)"> {{ fave(beer) }} </button> {{ formattedBeer(beer) }}</li>
        </ul>

      </div>

      <div id="faveList">

        <h3>Favorite Beers</h3>

        <p v-if="!favorites.length">No favorited beers...</p>
        <ul>
          <li v-for="beer in favorites"><button v-on:click="toggleFavorite(beer)"> {{ fave(beer) }} </button> {{ formattedBeer(beer) }}</li>
        </ul>

      </div>
    </div>
  `,

  methods: {
    toggleFavorite(beer) {

       if (!beer.favorite) {
         beer.favorite = true;
         this.favorites.push(beer);
       }

       else {
         beer.favorite = false;
         const index = this.favorites.indexOf(beer);
         this.favorites.splice(index, 1);
       }
    },

    formattedBeer(beer) {
      return `Name: ${beer.name} - ABV: ${beer.abv} - IBU: ${beer.ibu}`
    },

    fave(beer) {
      if (beer.favorite) {
        return "Unfavorite";
      }

      else {
        return "Favorite";
      }
    }
  }
})

var app = new Vue({
  el: '#app',
})
