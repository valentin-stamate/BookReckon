import { Component } from '@angular/core';
import {Book} from "../../service/interfaces";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent {

  book: Book = {} as any;
  youtubeUrl: SafeUrl = '';

  constructor(private _sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.onFetchBook();
  }

  /* https://stackoverflow.com/a/60803005/10805602 */
  async onFetchBook() {
    this.book =   {
      id: 1,
      title: 'The Lord of the rings',
      genre: 'Adventure',
      authors: 'J. R. R. Tolkien',
      audioBook: "https://www.youtube.com/watch?v=BP9tN1agnxo",
      photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKELWizv0-IkvAYh0vNpNf_eMY_3y1ikaKk0z7V7yj4K0v4Ebs',
      description: "Bilbo celebrates his eleventy-first (111th) birthday and leaves the Shire suddenly, passing the Ring to Frodo Baggins, his cousin[c] and heir. Neither hobbit is aware of the Ring's origin, but the wizard Gandalf suspects it is a Ring of Power. Seventeen years later, Gandalf tells Frodo that he has confirmed that the Ring is the one lost by the Dark Lord Sauron long ago and counsels him to take it away from the Shire. Gandalf leaves, promising to return by Frodo's birthday and accompany him on his journey, but fails to do so. Frodo sets out on foot,     offering a cover story of moving to Crickhollow,     accompanied by his gardener Sam Gamgee and his cousin Pippin Took.They are pursued by mysterious Black Riders,     but meet a passing group of Elves led by Gildor Inglorion,     whose chants to Elbereth ward off the Riders.The hobbits spend the night with them,     then take an evasive short cut the next day,     and arrive at the farm of Farmer Maggot,     who takes them to Bucklebury Ferry,     where they meet their friend Merry Brandybuck.When they reach the house at Crickhollow,     Merry and Pippin reveal they know about the Ring and insist on travelling with Frodo and Sam.     They decide to try to shake off the Black Riders by cutting through the Old Forest.Merry and Pippin are trapped by Old Man Willow,     an ancient tree who controls much of the forest,     but are rescued by Tom Bombadil.Leaving the refuge of Tom 's house, they get lost in a fog and are caught by a barrow-wight in a barrow on the downs, but Frodo, awakening from the barrow-wight' s spell,     calls Tom Bombadil,     who frees them,     and equips them with ancient swords from the barrow - wight 's hoard. The hobbits reach the village of Bree,     where they encounter a Ranger named Strider.The innkeeper gives Frodo a letter from Gandalf written three months before which identifies Strider as a friend.Knowing the riders will attempt to seize the party,     Strider cunningly avoids their attack and leads the hobbits through the wilderness toward the Elven sanctuary of Rivendell.On the way to Rivendell,     the group stops at the hill Weathertop.Strider identifies the riders as the Nazgûl,     men from ancient times that were enslaved by lesser Rings of Power to serve Sauron.While at Weathertop,     they are again attacked by five of the nine Black Riders.During the struggle,     the Lord of the Nazgûl wounds Frodo with a cursed blade.After fighting off the Nazgûl,     Strider treats Frodo with the herb athelas,     and is joined by the elf Glorfindel who has been searching for the party.Glorfindel rides with Frodo,     now deathly ill,     toward Rivendell.The Nazgûl nearly capture Frodo at the Ford of Bruinen,     but upon attempting to cross the ford flood waters summoned by Elrond,     master of Rivendell,     and Gandalf rise up and overwhelm the Nazgûl. ",
      imdb: 'https://www.imdb.com/title/tt0120737/',
      youtube: 'https://www.youtube.com/watch?v=N4xV2RIlMi4',
    };

    const matches = this.book.youtube.split(/v=/g);

    if (matches != null) {
      const url = `https://www.youtube.com/embed/${matches[1]}`
      this.youtubeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    console.log(this.youtubeUrl)

  }

}