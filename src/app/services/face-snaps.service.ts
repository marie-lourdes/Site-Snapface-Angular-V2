import { Injectable } from '@angular/core';
import { FaceSnap } from '../models/face-snap.model';

@Injectable({
  providedIn: 'root'
})
export class FaceSnapsService {
  faceSnaps: FaceSnap[] = [
    {
      id: 1,
      title: 'Tome 1 archibald',
      description: 'Livre policier en plusieurs tomes!',
      imageUrl: "../../assets/images/book.jpg",
      createdDate: new Date(),
      snaps: 47,
      location: 'Paris'
    },
    {
      id: 2,
      title: 'Mountain',
      description: 'livre de romance',
      imageUrl: "../../assets/images/book-antique.jpg",
      createdDate: new Date(),
      snaps: 6,
      location: 'la montagne'
    },
    {
      id: 3,
      title: 'Jumanji',
      description: 'livre de science fiction',
      imageUrl: "../../assets/images/books.jpg",
      createdDate: new Date(),
      snaps: 156
    },
    {
      id: 4,
      title: 'Tome 2 archibald',
      description: 'Livre policier en plusieurs tomes!',
      imageUrl: "../../assets/images/book-library.jpg",
      createdDate: new Date(),
      snaps: 89,
      location: 'Paris'
    },
    {
      id: 5,
      title: 'Chair de poule',
      description: 'Un livre fantastique ',
      imageUrl: "../../assets/images/book-desk.jpg",
      createdDate: new Date(),
      snaps: 27,
      location: 'la montagne'
    },
    {
      id: 6,
      title: 'Tome 3 archibald',
      description: 'Livre policier en plusieurs tomes!',
      imageUrl: 'https://wtop.com/wp-content/uploads/2020/06/HEALTHYFRESH.jpg',
      createdDate: new Date(),
      snaps: 101
    }
  ];

  getAllFaceSnaps(): FaceSnap[] {
    return this.faceSnaps;
  }

  getFaceSnapById(faceSnapId: number): FaceSnap {
    const faceSnap = this.faceSnaps.find(faceSnap => faceSnap.id === faceSnapId);
    if (!faceSnap) {
      throw new Error('FaceSnap not found!');
    } else {
      return faceSnap;
    }
  }

  snapFaceSnapById(faceSnapId: number, snapType: 'snap' | 'unsnap'): void {
    const faceSnap = this.getFaceSnapById(faceSnapId);
    snapType === 'snap' ? faceSnap.snaps++ : faceSnap.snaps--;
  }
}
